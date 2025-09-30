export const protegerRuta = (req, res, next) => {
    if (req.session && req.session.autenticado) {
        return next();
    }
    res.redirect("/login");
};

export const redirigirSiAutenticado = (req, res, next) => {
    if (req.session && req.session.autenticado) {
        return res.redirect("/panelAdmin");
    }
    next();
};
