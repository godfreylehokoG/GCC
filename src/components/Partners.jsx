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
    },
    {
        id: 3,
        name: "Global Gold Coin",
        logo: "/globalgoldcoinlogo.png",
        role: "Wealth Creation Vehicle"
    }
];

// SVG leopard spot pattern encoded as a data URI for the background
const leopardPatternSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cellipse cx='30' cy='30' rx='12' ry='9' fill='none' stroke='rgba(139,119,75,0.12)' stroke-width='2.5' transform='rotate(-20,30,30)'/%3E%3Cellipse cx='80' cy='25' rx='10' ry='7' fill='none' stroke='rgba(139,119,75,0.10)' stroke-width='2' transform='rotate(15,80,25)'/%3E%3Cellipse cx='140' cy='35' rx='14' ry='10' fill='none' stroke='rgba(139,119,75,0.13)' stroke-width='2.5' transform='rotate(-30,140,35)'/%3E%3Cellipse cx='55' cy='75' rx='11' ry='8' fill='none' stroke='rgba(139,119,75,0.11)' stroke-width='2' transform='rotate(25,55,75)'/%3E%3Cellipse cx='120' cy='80' rx='13' ry='9' fill='none' stroke='rgba(139,119,75,0.12)' stroke-width='2.5' transform='rotate(-15,120,80)'/%3E%3Cellipse cx='175' cy='70' rx='10' ry='7' fill='none' stroke='rgba(139,119,75,0.10)' stroke-width='2' transform='rotate(10,175,70)'/%3E%3Cellipse cx='25' cy='125' rx='13' ry='9' fill='none' stroke='rgba(139,119,75,0.13)' stroke-width='2.5' transform='rotate(-25,25,125)'/%3E%3Cellipse cx='90' cy='130' rx='11' ry='8' fill='none' stroke='rgba(139,119,75,0.11)' stroke-width='2' transform='rotate(20,90,130)'/%3E%3Cellipse cx='155' cy='125' rx='12' ry='9' fill='none' stroke='rgba(139,119,75,0.12)' stroke-width='2.5' transform='rotate(-10,155,125)'/%3E%3Cellipse cx='45' cy='175' rx='10' ry='7' fill='none' stroke='rgba(139,119,75,0.10)' stroke-width='2' transform='rotate(30,45,175)'/%3E%3Cellipse cx='110' cy='170' rx='14' ry='10' fill='none' stroke='rgba(139,119,75,0.13)' stroke-width='2.5' transform='rotate(-20,110,170)'/%3E%3Cellipse cx='175' cy='165' rx='11' ry='8' fill='none' stroke='rgba(139,119,75,0.11)' stroke-width='2' transform='rotate(5,175,165)'/%3E%3Ccircle cx='30' cy='30' r='3' fill='rgba(139,119,75,0.07)'/%3E%3Ccircle cx='140' cy='35' r='4' fill='rgba(139,119,75,0.06)'/%3E%3Ccircle cx='120' cy='80' r='3.5' fill='rgba(139,119,75,0.07)'/%3E%3Ccircle cx='25' cy='125' r='3' fill='rgba(139,119,75,0.06)'/%3E%3Ccircle cx='110' cy='170' r='4' fill='rgba(139,119,75,0.07)'/%3E%3C/svg%3E")`;

export default function Partners() {
    return (
        <section
            id="partners"
            className="relative py-20 px-6 md:px-10 border-y border-white/5 overflow-hidden"
            style={{
                backgroundImage: leopardPatternSvg,
                backgroundSize: '200px 200px',
                backgroundColor: 'rgba(11, 15, 43, 0.95)',
            }}
        >
            {/* Subtle warm overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-amber-900/5 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
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
