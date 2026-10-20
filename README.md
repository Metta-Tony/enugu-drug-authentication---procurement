# Enugu Drug Authentication & Procurement

Pharmaceutical verification and wholesale procurement portal for Enugu and South East Nigeria.

## Languages and Syntax Used

Here is a plain-language overview of the main languages and code styles used to build the website:

- **TypeScript (`.ts`)** adds labels to JavaScript values so the code can catch many mistakes before the site runs. In this project, it describes information such as medicines, locations, and procurement records.
- **TSX (`.tsx`)** is TypeScript with a readable way to describe what appears on the screen. React components use tags such as `<Header />` to build the page, and `{...}` to place changing information—such as the selected location—inside it.
- **React** is the tool used with TSX to split the website into reusable pieces, such as the header, authentication area, and procurement area. State syntax such as `useState(...)` remembers changing details like the selected tab and shopping cart.
- **HTML** provides the page's basic structure. `index.html` contains the page title, description, and the empty root element where the app is displayed.
- **CSS and Tailwind CSS** control how the page looks. Tailwind utility classes such as `bg-slate-900` and `text-white` apply background and text colors directly to page elements; `src/index.css` loads Tailwind.
- **JSON** stores settings in a structured format. Files such as `package.json` list the commands and software packages used by the project.

## Run Locally

**Prerequisites:** Node.js and npm

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Open `http://localhost:3000`.

## Deploy to GitHub Pages

The GitHub Actions workflow builds and publishes the site when you push to `main` or `master`.

1. In the repository, open **Settings > Pages**.
2. Set **Build and deployment > Source** to **GitHub Actions**.
3. After the workflow completes, open the URL shown in the deployment summary.
