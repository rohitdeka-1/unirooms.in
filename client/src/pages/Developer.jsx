import { Link } from 'react-router-dom';
const Developer = () => {
    const techStack = {
        frontend: [
            'React.js',
            'Tailwind CSS',
            'JavaScript (ES6+)',
            'HTML5 & CSS3',
            'Responsive Design'
        ],
        backend: [
            'Node.js',
            'Express.js',
            'MongoDB',
            'REST APIs',
            'JWT Authentication'
        ],
        tools: [
            'Git & GitHub',
            'VS Code',
            'Postman',
            'Heroku',
            'Vercel'
        ],
        services: [
            'Cloudinary',
            'Google OAuth',
            'Cashfree Payment Gateway',
            'Nodemailer',
            'Redis'
        ]
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 mt-7">
            <div className="container mx-auto px-4 py-12 md:py-20">
                {}
                <Link 
                    to="/" 
                    className="inline-flex items-center text-neutral-600 hover:text-primary-600 mb-8 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>
                {}
                <div className="max-w-4xl mx-auto">
                    {}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {}
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                RD
                            </div>
                            {}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">
                                    Rohit Deka
                                </h1>
                                <p className="text-xl text-primary-600 font-medium mb-4">
                                    Full Stack Developer
                                </p>
                                <p className="text-neutral-600 mb-6 leading-relaxed">
                                    A passionate developer from <span className="font-semibold text-neutral-800">Assam, India</span>, 
                                    currently pursuing my studies at <span className="font-semibold text-neutral-800">VIT Bhopal</span>. 
                                    I specialize in building modern, scalable web applications with a focus on user experience and clean code.
                                </p>
                                {}
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <a
                                        href="mailto:rohitdeka124@gmail.com"
                                        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email Me
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/rohitdekarhd"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://github.com/rohitdekarhd"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-8 flex items-center">
                            <svg className="w-8 h-8 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Tech Stack
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {}
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                    Frontend
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.frontend.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-200"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {}
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Backend
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.backend.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {}
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Tools & Platforms
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.tools.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {}
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    Services & APIs
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.services.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-8">
                        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-6">
                            About Unirooms
                        </h2>
                        <p className="text-neutral-600 leading-relaxed mb-4">
                            Unirooms is a comprehensive platform designed to connect students with quality PG accommodations near their universities. 
                            The platform features a modern, user-friendly interface with advanced search capabilities, secure payment integration, 
                            and verified property listings.
                        </p>
                        <p className="text-neutral-600 leading-relaxed">
                            Built with the MERN stack, this project showcases full-stack development skills including authentication, 
                            payment gateway integration, email services, cloud storage, and responsive design principles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Developer;
