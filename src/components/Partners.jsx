import { motion } from 'framer-motion';

const partners = [
    {
        id: 1,
        name: "Prince Lethukukhanya",
        logo: "/Prince-Lethukukhanya (1).png",
        role: "Strategic Partner"
    },
    {
        id: 2,
        name: "Mzilikazi Royal Foundation",
        logo: "/Mzilikazi-Royal.png",
        role: "Royal Heritage Partner"
    }
];

export default function Partners() {
    return (
        <section id="partners" className="py-20 px-6 md:px-10 bg-white/5 border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-12"
                >
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                        Official Partnerships
                    </span>
                    <h3 className="text-2xl font-bold text-white/90">Strategic Alliances</h3>
                </motion.div>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                    {partners.map((partner) => (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: partner.id * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center gap-4 group"
                        >
                            <div className="h-20 w-auto flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-h-full w-auto object-contain brightness-125"
                                />
                            </div>
                            <div className="text-center">
                                <h4 className="text-white font-semibold text-sm group-hover:text-indigo-400 transition-colors uppercase tracking-wider">
                                    {partner.name}
                                </h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                    {partner.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
