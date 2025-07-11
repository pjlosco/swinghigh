# SwingHigh Store - Custom Products E-commerce Site

A beautiful, modern e-commerce website built with Next.js, TypeScript, and Tailwind CSS, designed to showcase and sell custom products created on Printify.

## Features

- 🛍️ **Modern E-commerce Design** - Beautiful, responsive design with smooth animations
- 🔗 **Printify API Integration** - Seamlessly load and display your Printify products
- 📱 **Mobile-First** - Fully responsive design that works on all devices
- ⚡ **Fast Performance** - Built with Next.js for optimal speed and SEO
- 🎨 **Custom Styling** - Beautiful UI with Tailwind CSS and custom components
- 🔍 **Product Search & Filtering** - Easy product discovery
- 🛒 **Shopping Cart** - Add products to cart functionality
- 💳 **Payment Ready** - Structure ready for payment integration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API**: Printify REST API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Printify account with API access

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
   
   Edit `.env.local` and add your Printify API credentials:
   ```env
   PRINTIFY_API_KEY=your_actual_api_key_here
   PRINTIFY_SHOP_ID=your_shop_id_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Get your Printify API key**
   - Go to [Printify Dashboard](https://printify.com/app/settings/api-keys)
   - Create a new API key
   - Copy the key to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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
PRINTIFY_API_KEY=your_actual_printify_api_key
PRINTIFY_SHOP_ID=your_actual_shop_id
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
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
│   └── products/          # Products page
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   └── ProductCard.tsx    # Product display card
├── lib/                   # Utility functions
│   └── printify.ts        # Printify API integration
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
- Replace mock data in `lib/printify.ts` with real API calls
- Customize product display in `components/ProductCard.tsx`
- Add product categories and filtering

### Styling
- Modify global styles in `app/globals.css`
- Update component styles using Tailwind classes
- Add custom animations in `tailwind.config.js`

## API Integration

The site is set up to work with the Printify API. Key integration points:

- **Product Loading**: `lib/printify.ts` contains the API client
- **Product Display**: `components/ProductCard.tsx` shows product information
- **Real Data**: Currently fetches real products from your Printify shop

To connect to real Printify data:

1. Ensure your API key is set in `.env.local` (development) or Vercel environment variables (production)
2. The API calls in `lib/printify.ts` will automatically use your real data
3. Your actual Printify products will be displayed on the site

## Troubleshooting

### Common Issues

1. **Images not loading**: Make sure `images-api.printify.com` is configured in `next.config.js`
2. **API errors**: Check your Printify API key and shop ID are correct
3. **Build failures**: Ensure all dependencies are installed with `npm install`

### Vercel-Specific

1. **Environment variables**: Make sure all required env vars are set in Vercel dashboard
2. **Build timeouts**: The `vercel.json` config includes extended function timeouts
3. **Image optimization**: Next.js image optimization is enabled for Printify images

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
- Check the Printify API documentation

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