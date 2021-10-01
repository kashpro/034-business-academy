/* App styles */
import "@/scss/main.scss";

/* Development stats */
import Development from './modules/development.js';
if (process.env.NODE_ENV === "development") {Development.addWindowStatsElement();}


