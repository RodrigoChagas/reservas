"use strict";

const app = require("../../server/boot/success");

const isValidoHorarioAtendimento = () => {
  try {
    Reservas.status = (cb) => {
      let dataAtual = new Date();
      let horaAtual = dataAtual.getHours();
      let horaAbertura = 6;
      let horaFechamento = 20;

      console.log(`Horario atual é ${horaAtual}`);

      let resposta;
      if (horaAtual >= horaAbertura && horaAtual < horaFechamento) {
        resposta = "Estamos abertos!";
      } else {
        resposta =
          "Desculpe, não funcionamos nesse horario. Abrimos diariamente entre 6h até 20h.";
      }
      cb(null, resposta);
    };

    Reservas.remoteMethod("status", {
      http: { path: "/status", verb: "get" },
      returns: { type: "object", root: true },
    });
  } catch (err) {
    console.error("validarHorarioAtendimento ", err);
  }
};

const formatandoIdentificador = (data) => {
  console.info("ENTREI formatandoIdentificador");
  let date = new Date();
  let ano = date.getFullYear();
  let mes = date.getMonth();
  let dia = date.getDay();
  let cod = "924R1L10000";
  let complementoID = ano + mes + dia + cod;

  let id = data.id + complementoID;

  return id;
};
const criarReserva = async (data) => {
  try {
    /**
     *
     * ser gerados pela API e retornados para o chamador,usando valor autogerado para o id, default ("ativa")
     *  para o status e dafaultde data atual (new Date()) para o criadoEm, ignorando valores caso inputadospelo usuário
     *
     */
    let manipulados = [];
    let nomeQuadra,
      dataInicio,
      dataFim,
      statusQuadra,
      dataCriacao = null;

    nomeQuadra = data.tipo;
    dataInicio = data.inicioEm;
    dataFim = data.fimEm;
    statusQuadra = data.status;
    dataCriacao = data.criadoEm = new Date();

    console.time("isValidoHorarioAtendimento");
    await isValidoHorarioAtendimento();
    console.timeEnd("isValidoHorarioAtendimento");

    // valida o input da quadra
    console.time("isQuadraValida");
    await isQuadraValida(nomeQuadra);
    console.timeEnd("isQuadraValida");

    // valida o input da data inicio e fim de reserva
    console.time("validarEntradaDataReserva");
    await isValidaDataReserva(dataInicio, dataFim);
    console.timeEnd("validarEntradaDataReserva");

    console.time("isValidaEstadoReserva");
    await isValidaEstadoReserva(statusQuadra);
    console.timeEnd("isValidaEstadoReserva");

    manipulados.push(quadra, dataInicio, dataFim, statusQuadra, dataCriacao);
    return manipulados;
  } catch (err) {
    console.log("validarQuadra 9");
    console.error("ERROR criarReserva", err);
  }
};

// TODO criar metodo para validar o input do nome da quadra
/**
 * Regra:
 * Nome da quadra de tenis existentes :: SAIBRO ou HARD
 *
 */
const isQuadraValida = (data) => {
  try {
    console.info("ENTREI isQuadraValida");

    const validaInput = Reservas.validatesFormatOf(data, {
      with: /^[a-z\s]{0,255}$/i,
    });

    if (validaInput == "SAIBRO" || validaInput == "HARD") {
      console.log("SUCESSO");
    } else {
      console.log("Desculpe, mas só temos quadra SAIBRO ou HARD");
    }
    return validaInput;
  } catch (err) {
    throw new Error("metodo para validar o input do nome da quadra", err);
  }
};

// TODO criar metodo para validar o input das datas de reservas
const isValidarDataReserva = (inicioEm, fimEm) => {
  try {
    console.info("ENTREI isValidarDataReserva");

    Reservas.validatesDateOf("inicioEm", "fimEm", {
      message: "Error ",
    }),
      function (result) {
        if (!result) {
          console.error("ERROR validacao da DATA de reserva");
        } else {
          validarDuracaoReserva(inicioEm, fimEm);
          return;
        }
      };
    return;
  } catch (err) {
    throw new Error("validarEntradaDataReservas  ", err);
  }
};

// TODO criar metodo para validar o valor e duração da reserva
/**
 *
 * A duração deve ser o fimEm menos o inicioEm em minutos e o valor deve ser R$0.50 por minuto.
 *
 */
const validarDuracaoReserva = (inicioEm, fimEm) => {
  try {
    console.info("ENTREI validarDuracaoReserva");

    //TODO validar novamente o input
    Reservas.validatesPresenceOf("inicioEm", "fimEm");
    //TODO converter em minutos
    Reservas.isValid(() => {
      try {
        // cconvertendo em timestamp
        let dataInicio = Date.parse(inicioEm);
        let dataFim = Date.parse(fimEm);

        // cconvertendo para minuto
        let inicioMinutes = Math.floor(dataInicio / 60);
        let fimMinutes = Math.floor(dataFim / 60);

        let aluguelValorMinuto = fimMinutes - inicioMinutes;

        let valor = aluguelValorMinuto * 0.5;

        console.log("calculo", valor);
        return valor;
      } catch (err) {
        console.error("ERROR isValid", err);
      }
    });
  } catch (err) {
    throw new Error("Valor da reserva", err);
  }
};

// TODO criar metodo para validar a consistência dos dados antes de salvá-los e responder com statusCode adequado quando a requisição for inválida.
/**
 *
 * Adicionar a regra para validar o campo status; este deve conter apenas os valores "ativo", "cancelado" e "pago".
 *
 */
const isValidaEstadoReserva = (status) => {
  try {
    console.info("ENTREI isValidaEstadoReserva");
    if (status == "ativo") {
      return status;
    }
  } catch (err) {
    console.error("ERROR isValidaEstadoReserva", err);
  }
};

// TODO criar metodo para adicionar uma forma para os usuários verem o histórico dos cancelamentos adicionando a data de cancelamento na interface.
const historicorCancelamento = () => {};

// TODO criar metodo para validar se o duracao da reserva está sempre maior que 60 minutos
/**
 *
 * a operação foi decidido que todas as reservas devem ter "duracao" múltiplos 60 minutos, sempre começando nos inícios de horas, não podendo uma reserva começar ou terminar em horas quebradas.
 * As reservas podem ser múltiplos de 1h (1h, 2h, 3h), mas não podem ser horas quebradas (1h30min).
 *
 */
const validarTempoReserva = () => {};

//TODO criar metodo para verificar se o "slot" escolhido já foi usado em uma reserva ativa.
const validarReservaAtiva = () => {};

//TODO Antes de gravar a nova reserva precisamos conferir se o range (inicio - fim) já não foi reservado anteriormente e em caso afirmativo, devemos informar ao usuário que não podemos fazer a reserva.
const validarDataReserva = () => {};

module.exports = function (Reservas) {
  Reservas.criar = (data, cb) => {
    console.info("Reservass CRIAR");
    cb(null, data);
    return;
  };

  Reservas.remoteMethod("/", {
    accepts: [
      {
        arg: "data",
        type: "Reservas",
        description: "Criando Reserva",
        http: { source: "body" },
        required: true,
      },
      {
        arg: "request",
        type: "any",
        description: "O proprio request",
        http: function (ctx) {
          return ctx.req;
        },
        required: true,
      },
    ],
    http: { path: "/", verb: "post" },
    returns: { type: "Reservas", root: true },
    description: ["Criar a reserva"],
  });

  // intercepatador do loopback 3x
  Reservas.beforeRemote("**", async function logBefore(ctx, unused, next) {
    try {
      console.log("beforeRemote...");

      let data = [];
      data = ctx.req.body;

      console.time("criarReserva");
      await criarReserva(data);
      console.timeEnd("criarReserva");

      next();
      return;
    } catch (err) {
      console.error("ERROR beforeRemote", err);
    }
  });

  Reservas.afterRemote("**", async function logAfter(ctx, res, next) {
    try {
      console.log("afterRemote...");

      let data = [];
      let id = res.id;
      await formatandoIdentificador(id);

      res.id = id;
      console.log("setID", res.id);
      next();
      return;
    } catch (err) {
      console.error("ERROR afterRemote", err);
    }
  });

  Reservas.afterRemoteError("**", function logAfterError(ctx, next) {
    console.log("afterRemoteError...");

    if (!ctx.result) ctx.result = {};

    console.error(ctx.error);
    next(new Error("ERROR - Veja o log para mais detalhes!"));
  });
};
