import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="border-b p-6">
            <p className="text-4xl font-bold">NFT Marketplace</p>
            <div className="flex mt-4">
                <Link href="/">
                    <a className="mr-6 text-pink-500">
                        home
                    </a>
                </Link>
                <Link href="/create-item">
                    <a className="mr-6 text-pink-500">
                        sell digital asset
                    </a>
                </Link>
                <Link href="/my-assets">
                    <a className="mr-6 text-pink-500">
                        my digital assets
                    </a>
                </Link>
                <Link href="/creator-dashboard">
                    <a className="mr-6 text-pink-500">
                        creator dashboard
                    </a>
                </Link>
            </div>
        </nav>
    )
}

