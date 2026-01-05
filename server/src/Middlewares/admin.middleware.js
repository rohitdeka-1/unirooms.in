// Admin authorization middleware
// Only allows access to alkardorhd@gmail.com
export const isAdmin = (req, res, next) => {
    const ADMIN_EMAIL = 'alkardorhd@gmail.com';
    
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please login.",
        });
    }

    if (req.user.email !== ADMIN_EMAIL) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        });
    }

    next();
};
