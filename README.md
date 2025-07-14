# SwingHigh Store - Multi-Platform Custom Products E-commerce Site

A beautiful, modern e-commerce website built with Next.js, TypeScript, and Tailwind CSS, designed to showcase and sell custom products from both Printful and Printify platforms.

## Features

- 🛍️ **Modern E-commerce Design** - Beautiful, responsive design with smooth animations
- 🔗 **Multi-Platform Integration** - Seamlessly load and display products from both Printful and Printify
- 📱 **Mobile-First** - Fully responsive design that works on all devices
- ⚡ **Fast Performance** - Built with Next.js for optimal speed and SEO
- 🎨 **Custom Styling** - Beautiful UI with Tailwind CSS and custom components
- 🔍 **Product Search & Filtering** - Easy product discovery across platforms
- 🛒 **Shopping Cart** - Add products to cart functionality
- 💳 **Payment Ready** - Structure ready for payment integration
- 🏷️ **Platform Badges** - Clear indication of product source (Printful/Printify)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **APIs**: Printful REST API + Printify REST API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Printful account with API access
- Printify account with API access (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd swinghigh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API credentials:
   ```env
   # Printful API Configuration
   PRINTFUL_API_KEY=your_printful_api_key_here
   
   # Printify API Configuration (optional)
   PRINTIFY_API_KEY=your_printify_api_key_here
   PRINTIFY_SHOP_ID=your_printify_shop_id_here
   
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Get your API keys**
   - **Printful**: Go to [Printful Dashboard → API](https://www.printful.com/dashboard/api)
   - **Printify**: Go to [Printify Account → API Keys](https://printify.com/app/account/api-keys)
   - Create API keys and copy them to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Multi-Platform Support

This e-commerce site supports products from both Printful and Printify platforms:

### Printful Integration
- Fetches products from your Printful store
- Displays product variants and pricing
- Shows product images and descriptions
- Handles Printful's API limitations gracefully

### Printify Integration
- Fetches products from your Printify shop
- Displays detailed variant information (sizes, colors)
- Shows multiple product images
- Provides better variant data structure

### Unified Experience
- Products from both platforms are displayed together
- Platform badges clearly indicate product source
- Consistent pricing and variant display
- Unified product detail pages

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 3. Configure Environment Variables
In your Vercel project settings, add these environment variables:

```env
# Required
PRINTFUL_API_KEY=your_actual_printful_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Optional (for Printify support)
PRINTIFY_API_KEY=your_actual_printify_api_key
PRINTIFY_SHOP_ID=your_actual_printify_shop_id
```

### 4. Deploy
Click "Deploy" and Vercel will build and deploy your site automatically.

### 5. Custom Domain (Optional)
- In Vercel project settings, go to "Domains"
- Add your custom domain
- Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## Project Structure

```
swinghigh/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── products/          # Products pages
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   └── ProductCard.tsx    # Product display card
├── lib/                   # Utility functions
│   ├── printful.ts        # Printful API integration
│   ├── printify.ts        # Printify API integration
│   └── products.ts        # Unified product service
├── public/                # Static assets
├── vercel.json           # Vercel configuration
└── package.json           # Dependencies and scripts
```

## Customization

### Branding
- Update the logo and brand name in `components/Header.tsx`
- Modify colors in `tailwind.config.js`
- Update site metadata in `app/layout.tsx`

### Products
- The site automatically fetches products from both Printful and Printify
- Customize product display in `components/ProductCard.tsx`
- Add product categories and filtering
- Platform badges can be customized in the ProductCard component

### Styling
- Modify global styles in `app/globals.css`
- Update component styles using Tailwind classes
- Add custom animations in `tailwind.config.js`

## API Integration

The site is set up to work with both Printful and Printify APIs. Key integration points:

- **Unified Product Service**: `lib/products.ts` combines products from both platforms
- **Printful Integration**: `lib/printful.ts` contains the Printful API client
- **Printify Integration**: `lib/printify.ts` contains the Printify API client
- **Product Display**: `components/ProductCard.tsx` shows unified product information
- **Real Data**: Fetches real products from both platforms

To connect to real data:

1. Ensure your API keys are set in `.env.local` (development) or Vercel environment variables (production)
2. The unified product service will automatically fetch from both platforms
3. Your actual products will be displayed together on the site

## Troubleshooting

### Common Issues

1. **Images not loading**: Make sure CDN domains are configured in `next.config.js`
2. **API errors**: Check your API keys are correct for both platforms
3. **Build failures**: Ensure all dependencies are installed with `npm install`
4. **No products showing**: Verify products exist in your Printful/Printify stores

### Platform-Specific

1. **Printful**: Products must be synced to your store in the Printful dashboard
2. **Printify**: Products must be published to your shop in the Printify dashboard
3. **API Limits**: Both platforms have rate limits - the app handles this gracefully

### Vercel-Specific

1. **Environment variables**: Make sure all required env vars are set in Vercel dashboard
2. **Build timeouts**: The `vercel.json` config includes extended function timeouts
3. **Image optimization**: Next.js image optimization is enabled for both platforms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the [Printful API documentation](https://developers.printful.com/)
- Check the [Printify API documentation](https://printify.com/app/api-docs)

## Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] User authentication
- [ ] Order management
- [ ] Product reviews
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Shipping calculator
- [ ] Multi-language support
- [ ] PWA features
- [ ] Platform-specific filtering
- [ ] Advanced product search