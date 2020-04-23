"use strict";

module.exports = function (Reservas) {
  // TODO criar metodo para validar o input do nome da quadra
  /**
   *
   * Nome da quadra de tenis existentes :: SAIBRO ou HARD
   *
   */

  let validaTipo = Reservas.validatesFormatOf("tipo", {with: /^[a-z\s]{0,255}$/i,}); 

  // TODO criar metodo para validar o input das datas de reservas
  let date = Reservas.validatesDateOf("inicioEm", "fimEm", {
    message: "Error ",
  });

  // TODO criar metodo para validar o valor e duração da reserva
  /**
   *
   * A duração deve ser o fimEm menos o inicioEm em minutos e o valor deve ser R$0.50 por minuto.
   *
   */

  // TODO criar metodo para adicionar uma forma para os usuários verem o histórico dos cancelamentos adicionando a data de cancelamento na interface.

  // TODO criar metodo para validar a consistência dos dados antes de salvá-los e responder com statusCode adequado quando a requisição for inválida.
  /**
   *
   * Adicionar a regra para validar o campo status; este deve conter apenas os valores "ativo", "cancelado" e "pago".
   *
   */

  // TODO criar metodo para validar se o duracao da reserva está sempre maior que 60 minutos
  /**
   *
   * a operação foi decidido que todas as reservas devem ter "duracao" múltiplos 60 minutos, sempre começando nos inícios de horas, não podendo uma reserva começar ou terminar em horas quebradas.
   * As reservas podem ser múltiplos de 1h (1h, 2h, 3h), mas não podem ser horas quebradas (1h30min).
   *
   */


   //TODO criar metodo para verificar se o "slot" escolhido já foi usado em uma reserva ativa.

   //TODO Antes de gravar a nova reserva precisamos conferir se o range (inicio - fim) já não foi reservado anteriormente e em caso afirmativo, devemos informar ao usuário que não podemos fazer a reserva.
};
