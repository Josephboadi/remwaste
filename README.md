# REMWaste Project

This project is built using React + TypeScript + Vite + Tailwind Css. It is build to follow some ESLint and Prettier rules. Without adhering to the rules, you cannot build the project.

### Main Tools Used in Building Project
* React + Typescript + Vite
* Tailwind css
* Tanstack Query
* Axios
* Framer motion

### Check Lint and Prettier Issues
* `Pnpm run lint:check`
* `Pnpm run prettier:check`

### Fix Lint and Prettier Issues
* `Pnpm run lint:fix`
* `Pnpm run prettier:fix`

### Project Breakdown
* The project was built with focus on clean, maintainable, responsiveness, and UI/UX improvements.
* Additional features like search, Pagination, sorting and filtering have been implemented.
* Data is persisted using localhost
* Some animations have also been implemented


### Two ways of running the project
* Docker approach:
  - The project has been dockerized and a docker image has been built and push to dockerhub.
  - You can simple access the image from `jboadi/remwaste:stable`
  - And you can spin up a container with the following image; `jboadi/remwaste:stable` on port `80`.
  - Then you run `http:localhost:80` to access the page.

* Github approach:
  - You can clone the github repository using the following command; `git clone https://github.com/Josephboadi/remwaste.git`
  - Create a `.env` file in the root directory and enter the environment variables provided at the bottom;
  - run `pnpm install` to install packages.
  - run `pnpm run dev` to start the app.

### Environment variables
  - `VITE_PROXY_BASE_URL=https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft`
  - `VITE_API_URL=https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft`
