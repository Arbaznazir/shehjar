# Restaurant Website

A modern restaurant website with elegant design featuring high-quality food photography on a dark background.

## Image Requirements

For the website to display correctly, please add the following images to the `public/images` directory:

- `hero-food.jpg` - A high-quality hero image for the homepage (recommended size: 1920x1080px)
- `steak.jpg` - Image of a premium steak dish (recommended size: 800x600px)
- `salad.jpg` - Image of a fresh salad with protein (recommended size: 800x600px)
- `dessert.jpg` - Image of a gourmet dessert (recommended size: 800x600px)

Other menu item images should be placed in the same directory and referenced in the `menuData.js` file.

## Pages

- **Home Page**: Elegant showcase of signature dishes with dark background and gold accents
- **Menu Page**: Complete restaurant menu organized by categories
- **Admin Area**: Protected area for restaurant management (login required)

## Admin Features

The site includes a complete admin interface with the following features:

- **Authentication**: Secure login (default credentials: admin/admin123)
- **Analytics Dashboard**: Monitor sales, track popular items, and view revenue metrics
- **Menu Manager**: Add, edit, or remove menu items and categories
- **Image Uploader**: Upload and manage images for menu items
- **Monthly Reports**: Export data to CSV files for monthly business reporting

## Development

This is a Next.js project. To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Mobile-responsive design
- Categorized menu display (Rice, Bakery, Chicken, Momos, Wazwan)
- Price calculation with 18% GST
- Gradient color scheme based on the specified brand colors
- Interactive menu category navigation
- Admin dashboard with business analytics

## Getting Started

### Prerequisites

- Node.js 14.0 or later

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd restaurant-website
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

5. Access the admin area at [http://localhost:3000/admin/login](http://localhost:3000/admin/login) with:
   - Username: admin
   - Password: admin123

## Project Structure

- `app/` - Next.js 13+ App Router directory

  - `components/` - React components used throughout the site
  - `data/` - Data files including menu items
  - `services/` - Service utilities for data management
  - `admin/` - Admin interface pages and components
  - `page.js` - Homepage component
  - `layout.js` - Root layout component
  - `globals.css` - Global CSS styles

- `public/` - Static assets
  - `images/` - Image files for menu items

## Customization

### Adding Menu Items

To add or modify menu items, use the Admin Menu Manager or directly update the `app/data/menuData.js` file with your desired items following the existing format.

### Changing Images

Replace placeholder images in the `public/images/` directory with your actual food images. Make sure to use the same filenames referenced in the menu data.

### Modifying Colors

The color scheme uses a gradient from left to right with the colors:

- Left & Right: rgba(182, 155, 76, 255)
- Center: rgba(234, 219, 102, 255)

To change the colors, modify the Tailwind CSS theme in `tailwind.config.js` and update the gradient definitions in `globals.css`.

## License

This project is licensed under the MIT License.
