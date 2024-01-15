import chalk from "chalk";
import app from "./app";
import { PORT } from "./config/env";
import { redisClient } from "./utils/redisClient";

app.listen(PORT, async() => {
  console.log(chalk.hex("#3c3").bold(`Server listening on port ${PORT}`));
  await redisClient()
});

export default app;
