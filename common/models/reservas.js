"use strict";

const app = require("../../server/boot/success");

const isValidoHorarioAtendimento = () => {
  try {
    console.log("ENTREI isValidoHorarioAtendimento");
    let dataAtual = new Date();
    let horaAtual = dataAtual.getHours();
    let horaAbertura = 6;
    let horaFechamento = 20;

    console.log(`Horario atual é ${horaAtual}`);

    let resposta = null;
    if (horaAtual >= horaAbertura && horaAtual < horaFechamento) {
      resposta = "Estamos abertos!";
      console.info(resposta);
    } else {
      resposta =
        "Desculpe, não funcionamos nesse horario. Abrimos diariamente entre 6h até 20h.";
      console.info(resposta);
    }
    return;
  } catch (err) {
    console.error("validarHorarioAtendimento ", err);
  }
};

const formatandoIdentificador = (id) => {
  try {
    console.info("ENTREI formatandoIdentificador");
    let date = new Date();
    let ano = date.getFullYear();
    let mes = date.getMonth();
    let dia = date.getDay();
    let cod = "924R1L10000";
    let complementoID = ano + mes + dia + cod;

    let idFormatado = id + complementoID;
    return idFormatado;
  } catch (err) {
    console.error("formatandoIdentificador", err);
  }
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

    manipulados.push(
      nomeQuadra,
      dataInicio,
      dataFim,
      statusQuadra,
      dataCriacao
    );
    return manipulados;
  } catch (err) {
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

    if (data == "SAIBRO" || data == "HARD") {
      console.log("SUCESSO");
    } else {
      console.log("Desculpe, mas só temos quadra SAIBRO ou HARD");
    }
    return data;
  } catch (err) {
    throw new Error("metodo para validar o input do nome da quadra", err);
  }
};

// TODO criar metodo para validar o input das datas de reservas
const isValidaDataReserva = (inicioEm, fimEm) => {
  try {
    console.info("ENTREI isValidaDataReserva");

    var dataInicio = null;
    var dataFim = null;
    if (inicioEm && fimEm) {
      let dia = inicioEm.substring(8, 10);
      let mes = inicioEm.substring(5, 7);
      let ano = inicioEm.substring(0, 4);
      let hora = inicioEm.substring(11, 13);

      let horaGMT = parseInt(hora) - 3;
      horaGMT.toString();

      console.log(dia + mes + ano + hora);
      dataInicio = `${dia}/${mes}/${ano}:${horaGMT}:00:00`;
      dataFim = `${dia}/${mes}/${ano}:${hora}:00:00`;

      console.log("dataInicio", dataInicio);
      console.log("dataFim", dataFim);
    }
    return dataInicio, dataFim;
  } catch (err) {
    console.error("isValidaDataReserva  ", err);
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
    if (inicioEm && fimEm) {
      let dataInicio = null;
      let dataFim = null;
      let hora = inicioEm.getHours();
      let dia = inicioEm.getDate();
      let mes = inicioEm.getMonth();
      let ano = inicioEm.getFullYear();

      dataInicio = `${dia}/${mes}/${ano}:${hora}:00:00`;
      dataFim = `${dia}/${mes}/${ano}:${hora}:00:00`;
    } else {
      console.error("Datas invalidas!!");
    }

    //TODO converter em minutos
    // convertendo formato de data em timestamp
    let dataInicio = Date.parse(inicioEm);
    let dataFim = Date.parse(fimEm);

    // convertendo para minuto
    let inicioMinutes = Math.floor(dataInicio / 60);
    let fimMinutes = Math.floor(dataFim / 60);

    let aluguelValorMinuto = fimMinutes - inicioMinutes;

    let valor = aluguelValorMinuto * 0.5;

    console.log("calculo", valor);
    return valor;
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
  Reservas.criar = (data, request, cb) => {
    criarReserva(data, request)
      .then((result) => {
        return result;
      })
      .cactch((err) => {
        cb(err, null);
      });
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

      let data = res;
      let id = data.id;

      console.time("formatandoIdentificador");
      await formatandoIdentificador(id);
      console.timeEnd("formatandoIdentificador");

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
