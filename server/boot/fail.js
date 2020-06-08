module.exports = function (app) {
    var remotes = app.remotes();
  
    const acompanhado = remotes.after("**", function (cb, next) {
      // Response Body http code 200
      cb.result = {
        code: 500,
        message: cb.methodString + " fail",
        data: cb.result,
        result: "fail",
      };
      next();
    });
  
    return acompanhado;
  };
  