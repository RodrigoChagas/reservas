"use strict";

const app = require("../../server/boot/success");

/** Retorna se a quadra é valida
 * @param {string} tipo
 * @return {boolean}
 */
const isQuadraValida = (tipo) => {
  tt == "SAIBRO" || tt == "HARD" ? `Quadra ${tipo}` : "Quadra nao existe";

  return tt;
};

const validarHorarioAtendimento = () => {
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

const criarReserva = (data, request) => {
  try {
    /**
     *
     * ser gerados pela API e retornados para o chamador,usando valor autogerado para o id, default ("ativa")
     *  para o status e dafaultde data atual (new Date()) para o criadoEm, ignorando valores caso inputadospelo usuário
     *
     */
    console.info("======>>>>", data);

    let quadra = data.tipo;
    let dataInicio = data.inicioEm;
    let dataFim = data.fimEm;
    let id = data.id + "924R1L10000";
    let status = data.status;
    let dataCriacao = (data.criadoEm = new Date());

    const validarQuadra = (quadra) => {
      try {
        return new Promise((resolve, reject) => {
          if (!isQuadraValida(quadra)) {
            reject("ERROR criar reserva");
          } else if (!dataInicio) {
            //Todo criar metodo para validar se a data esta disponivel
            reject("ERROR dataInicio");
          } else if (!dataFim) {
            reject("ERROR dataFim");
          } else if (status != ativa) {
            reject("ERROR");
          }
          console.log("ENTREI");
          resolve();
        });
      } catch (err) {
        console.error("validarQuadra", err);
      }
    };
  } catch (err) {
    console.error("criarReserva", err);
  }
};

// TODO criar metodo para validar o input do nome da quadra
/**
 * Regra:
 * Nome da quadra de tenis existentes :: SAIBRO ou HARD
 *
 */
function validarQuadra() {
  try {
    const validaInput = Reservas.validatesFormatOf("tipo", {
      with: /^[a-z\s]{0,255}$/i,
    });

    if (validaInput == "SAIBRO" || validaInput == "HARD") {
      console.log("SUCESSO");
    } else {
      console.log("Desculpe, mas hoje só temos quadra SAIBRO ou HARD");
    }
    return validaInput;
  } catch (err) {
    throw new Error("metodo para validar o input do nome da quadra", err);
  }
}

// TODO criar metodo para validar o input das datas de reservas
const validarEntradaDataReserva = () => {
  try {
    Reservas.validatesDateOf("inicioEm", "fimEm", {
      message: "Error ",
    });
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
const validarDuracaoReserva = () => {
  try {
    //TODO converter em minutos
    Reservas.validatesPresenceOf("inicioEm", "fimEm");
    Reservas.isValid((valid) => {
      // cconvertendo em timestamp
      let dataInicio = Date.parse(inicioEm);
      let dataFim = Date.parse(fimEm);

      // cconvertendo para minuto
      let inicioMinutes = Math.floor(dataInicio / 60);
      let fimMinutes = Math.floor(dataFim / 60);

      let aluguelValorMinuto = fimMinutes - inicioMinutes;

      let calc = aluguelValorMinuto * 0.5;

      console.log("aaaa", dataInicio, dataFim);
    });
  } catch (err) {
    throw new Error("Valor da reserva", err);
  }
};

// TODO criar metodo para adicionar uma forma para os usuários verem o histórico dos cancelamentos adicionando a data de cancelamento na interface.
const historicorCancelamento = () => {};

// TODO criar metodo para validar a consistência dos dados antes de salvá-los e responder com statusCode adequado quando a requisição for inválida.
/**
 *
 * Adicionar a regra para validar o campo status; este deve conter apenas os valores "ativo", "cancelado" e "pago".
 *
 */
const validarEstadoReserva = () => {};

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
  console.info("1");

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
  Reservas.beforeRemote("**", function logBefore(ctx, next) {
    console.log("About to invoke a method.");
    next();
  });

  Reservas.afterRemote("**", function logAfter(ctx, next) {
    try {
      console.log("afterRemote.", ctx);
      next();
    } catch (err) {
      console.error("afterRemote", err);
    }
  });

  Reservas.afterRemoteError("**", function logAfterError(ctx, next) {
    console.log("Method failed: ", ctx.error);
  });

  Reservas.criar = (data, request, cb) => {
    console.info("2");
    criarReserva(data, request)
      .then((result) => {
        console.info("3");
        if (result) {
          return app.Reservas(result, request, cb);
        }
      })
      .catch((err) => {
        cb(error, null);
      });
  };

  console.info("4");
};
