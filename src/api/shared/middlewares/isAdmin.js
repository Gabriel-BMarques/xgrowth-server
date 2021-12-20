// admin middleware
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  } else {
    throw new Error(
      JSON.stringify({
        'en-US': 'Unauthorized!',
        'pt-BR': 'Não autorizado!',
      })
    );
  }
};
