import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
    {
        title: "For developers",
        links: [
            { name: "Go Pro!", url: "#" },
            { name: "Explore development work", url: "#" },
            { name: "Development blog", url: "#" },
            { name: "Code podcast", url: "#" },
            { name: "Open-source projects", url: "#" },
            { name: "Refer a Friend", url: "#" },
            { name: "Code of conduct", url: "#" },
        ],
    },
    {
        title: "Hire developers",
        links: [
            { name: "Post a job opening", url: "#" },
            { name: "Post a freelance project", url: "#" },
            { name: "Search for developers", url: "#" },
        ],
    },
    {
        title: "Brands",
        links: [
            { name: "Advertise with us", url: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About", url: "#" },
            { name: "Careers", url: "#" },
            { name: "Support", url: "#" },
            { name: "Media kit", url: "#" },
            { name: "Testimonials", url: "#" },
            { name: "API", url: "#" },
            { name: "Terms of service", url: "#" },
            { name: "Privacy policy", url: "#" },
            { name: "Cookie policy", url: "#" },
        ],
    },
];

const socialLinks = [
    { name: 'Instagram', icon: '/instagram.svg', url: '#' },
    { name: 'Twitter', icon: '/twitter.svg', url: '#' },
    { name: 'GitHub', icon: '/github.svg', url: '#' },
];

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="flex flex-col gap-12 w-full">
                <div className="flex flex-col items-start">
                    <Image src="/logo-purple.svg" width={115} height={38} alt="Flexibble" />
                    <p className="text-start text-sm font-normal mt-5 max-w-xs">
                        Flexibble is the world's leading community for creatives to share, grow, and get hired.
                    </p>
                </div>
                <div className="flex flex-wrap gap-12">
                    <FooterColumn title={footerLinks[0].title} links={footerLinks[0].links} />
                    <div className="flex-1 flex flex-col gap-4">
                        <FooterColumn title={footerLinks[1].title} links={footerLinks[1].links} />
                        <FooterColumn title={footerLinks[2].title} links={footerLinks[2].links} />
                    </div>
                    <FooterColumn title={footerLinks[3].title} links={footerLinks[3].links} />
                    <div className="flex-1 flex flex-col gap-4">
                        <h4 className="font-semibold">Get the app</h4>
                        <Link href="https://apps.apple.com/minecraft" target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/apple-store.svg"
                                width={162}
                                height={48}
                                alt="Download on the App Store"
                                className="object-contain hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <Link href="https://play.google.com/store/apps/details?id=com.mojang.minecraftpe" target="_blank"
                              rel="noopener noreferrer">
                            <Image
                                src="/google-play.svg"
                                width={182}
                                height={54}
                                alt="Get it on Google Play"
                                className="object-contain hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flexBetween footer_copyright">
                <p>@ 2023 Flexibble. All rights reserved</p>
                <p className="text-gray">
                    <span className="text-black font-semibold">10,214</span> projects submitted
                </p>
            </div>
        </footer>
    );
};

type FooterColumnProps = {
    title: string;
    links: Array<{ name: string; url: string }>;
};

const FooterColumn: React.FC<FooterColumnProps> = ({title, links}) => (
    <div className="footer_column">
        <h4 className="font-semibold">{title}</h4>
        <ul className="flex flex-col gap-2 font-normal">
            {links.map((link) => (
                <li key={link.name}>
                    <Link href={link.url} className="text-gray-600 hover:text-black transition-colors">
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;