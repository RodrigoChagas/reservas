"use strict";

module.exports = function (Reservas) {
  // TODO criar metodo para validar o input do nome da quadra
  /**
   * Regra:
   * Nome da quadra de tenis existentes :: SAIBRO ou HARD
   *
   */
  const validaQuadra = () => {
    try {
      Reservas.validatesFormatOf("tipo", {
        with: /^[a-z\s]{0,255}$/i,
      });
    } catch (err) {
      throw new Error("metodo para validar o input do nome da quadra", err);
    }
  };

  // TODO criar metodo para validar o input das datas de reservas
  const validaEntradaDataReserva = () => {
    try {
      Reservas.validatesDateOf("inicioEm", "fimEm", {
        message: "Error ",
      });
    } catch (err) {
      throw new Error("metodo para validar o input das datas de reservas", err);
    }
  };

  // TODO criar metodo para validar o valor e duração da reserva
  /**
   *
   * A duração deve ser o fimEm menos o inicioEm em minutos e o valor deve ser R$0.50 por minuto.
   *
   */
  const validaDuracaoReserva = () => {
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



        console.log(dataInicio, dataFim);
      });
    } catch (err) {
      throw new Error("Valor da reserva", err);
    }
  };

  // TODO criar metodo para adicionar uma forma para os usuários verem o histórico dos cancelamentos adicionando a data de cancelamento na interface.
  const historicoCancelamento = () => {};

  // TODO criar metodo para validar a consistência dos dados antes de salvá-los e responder com statusCode adequado quando a requisição for inválida.
  /**
   *
   * Adicionar a regra para validar o campo status; este deve conter apenas os valores "ativo", "cancelado" e "pago".
   *
   */
  const validaEstadoReserva = () => {};

  // TODO criar metodo para validar se o duracao da reserva está sempre maior que 60 minutos
  /**
   *
   * a operação foi decidido que todas as reservas devem ter "duracao" múltiplos 60 minutos, sempre começando nos inícios de horas, não podendo uma reserva começar ou terminar em horas quebradas.
   * As reservas podem ser múltiplos de 1h (1h, 2h, 3h), mas não podem ser horas quebradas (1h30min).
   *
   */
  const validaTempoReserva = () => {};

  //TODO criar metodo para verificar se o "slot" escolhido já foi usado em uma reserva ativa.
  const validaReservaAtiva = () => {};

  //TODO Antes de gravar a nova reserva precisamos conferir se o range (inicio - fim) já não foi reservado anteriormente e em caso afirmativo, devemos informar ao usuário que não podemos fazer a reserva.
  const validaDataReserva = () => {};
};
