import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/', icon: 'home' },
        { name: 'Browse', path: '/browse', icon: 'search' },
        { name: 'Saved', path: '/saved', icon: 'heart' },
        { name: 'Profile', path: '/profile', icon: 'user' },
    ];

    const getIcon = (icon) => {
        switch (icon) {
            case 'home':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
            case 'search':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />;
            case 'heart':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />;
            case 'user':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
            default:
                return null;
        }
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition ${isActive ? 'text-blue-600' : 'text-gray-600'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon(item.icon)}
                            </svg>
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
