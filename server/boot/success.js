module.exports = function (app) {
  var remotes = app.remotes();

  const acompanhado = remotes.after("**", function (cb, next) {
    // Response Body http code 200
    cb.result = {
      code: 200,
      message: cb.methodString + " success",
      data: cb.result,
      result: "success",
    };
    next();
  });

  return acompanhado;
};
