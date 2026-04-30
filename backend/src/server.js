import app from "./app.js";
import { PORT } from "./configenv.js";

app.listen(PORT || 5000, () => {
  console.log(`Server running on port ${PORT || 5000}`);
});