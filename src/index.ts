import { app } from "./main";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Ya toy en el http://localhost:${PORT}/`);
});
