import ProductPage from './ProductPage';

// Server-side meta data fetching
async function getProductData(slug, variant, token = null) {
    const query = variant ? `?variant=${variant}` : '';
    const url = `${process.env.NEXT_PUBLIC_LAMINUX_API_BASE_URL}product/${slug}${query}`;

    const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    const res = await fetch(url, {
        headers,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch product data: ${res.status}`);
    }

    return res.json();
}

// Server-side metadata generator
export async function generateMetadata({ params, searchParams }) {
    const slug = params.slug;
    const variant = searchParams?.variant || '';

    const token = null;

    try {
        const data = await getProductData(slug, variant, token);
        const product = data?.data;

        const thumbnailUrl = product?.thumbnail_image
            ? product.thumbnail_image.startsWith('http')
                ? product.thumbnail_image
                : `${process.env.NEXT_PUBLIC_LAMINUX_API_BASE_URL}/${product.thumbnail_image}`
            : null;

        return {
            title: product?.meta_title || product?.name || 'Product Name',
            description: product?.meta_description || product?.short_description || 'Product Description',
            openGraph: {
                title: product?.meta_title || product?.name || 'Product Name',
                description: product?.meta_description || product?.short_description || 'Product Description',
                type: 'website',
                images: thumbnailUrl
                    ? [
                        {
                            url: thumbnailUrl,
                            width: 800,
                            height: 600,
                            alt: product?.name || 'Product Image',
                        },
                    ]
                    : [],
            },
        };
    } catch (error) {
        console.error('Metadata fetch error:', error);
        return {
            title: 'Product Not Found',
            description: 'The product you are looking for does not exist.',
        };
    }
}

// Server component here
export default function Product() {
    return <ProductPage />;
}
