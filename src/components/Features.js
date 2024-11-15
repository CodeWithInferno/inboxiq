// components/Features.js

const Features = () => {
    return (
        <section className="relative py-24 bg-white dark:bg-[#1a1a2e]">
            <div className="container mx-auto px-4 flex items-center gap-16">
                {/* Partially hidden image using <img> tag */}
                <div className="absolute left-[-100px] lg:left-[-250px] hidden lg:block">
                    <img
                        src="/ss1.png" // Replace with your actual image path
                        alt="Demo Image"
                        className="object-cover max-w-[50%] rounded-lg shadow-2xl"
                        style={{ boxShadow: "0 0 20px 10px rgba(59, 130, 246, 0.5)"}} // Adds a partial clip effect
                    />
                </div>

                {/* Content */}
                <div className="ml-auto text-left text-balance max-w-xl">
                    <h2 className="text-indigo-600 font-bold mb-4 text-l">AI Email Assistant</h2>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                        Sorting, replying, archiving.<br /> Automate on your own terms.
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Keep getting emails that require the same response? Let InboxIQ handle it.
                    </p>
                    <ul className="space-y-6 text-gray-800 dark:text-gray-200">
                        <li className="flex items-start gap-3">
                            <span className="text-indigo-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                            </span>
                            <div>
                                <h4 className="font-semibold">Automate your replies</h4>
                                <p className="text-sm">Our AI agent will reply, forward, or archive emails based on the rules you provide it.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-indigo-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                            </span>
                            <div>
                                <h4 className="font-semibold">Planning mode</h4>
                                <p className="text-sm">Let our AI plan what to do for you. Accept or reject in a click.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-indigo-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                            </span>
                            <div>
                                <h4 className="font-semibold">Instruct in plain English</h4>
                                <p className="text-sm">Its as easy as talking to an assistant or sending a prompt to ChatGPT.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Features;












