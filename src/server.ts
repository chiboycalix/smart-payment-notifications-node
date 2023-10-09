import chalk from "chalk";
import { PORT } from "./config/env";
import app from "./app";

app.listen(PORT, () => {
  console.log(chalk.hex("#3c3").bold(`Server listening on port ${PORT}`));
});

export default app;
