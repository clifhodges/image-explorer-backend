const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { readdir, stat, existsSync, mkdirSync, unlinkSync } = require('fs');
const path = require('path');

const app = express();

const corsOptions = {
	origin: 'http://localhost:3000',
};
const port = 8000;

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use('/files', express.static(path.join(__dirname, 'public/uploads')));

app.use(
	fileUpload({
		limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
		useTempFiles: true,
		tempFileDir: '/tmp/',
	})
);

app.post('/upload', (req, res) => {
	if (!req.files || !req.files.file) {
		return res.status(422).send('No files were uploaded');
	}

	const uploadedFile = req.files.file;

	const fileName = uploadedFile.name.replaceAll(' ', '-');
	const filePath = path.join(__dirname, 'public/uploads', fileName);

	const uploadsDir = path.join(__dirname, 'public/uploads');
	if (!existsSync(uploadsDir)) {
		mkdirSync(uploadsDir, { recursive: true });
	}

	uploadedFile.mv(filePath, (err) => {
		if (err) {
			console.error('Error moving file:', err);
			return res.status(500).send('Error saving file');
		}

		res.json({
			message: 'File uploaded successfully',
			filename: fileName,
			path: filePath,
			url: `http://localhost:${port}/files/${fileName}`,
		});
	});
});

app.get('/files', (req, res) => {
	const uploadsDir = path.join(__dirname, 'public/uploads');

	if (!existsSync(uploadsDir)) {
		return res.json({ files: [] });
	}

	const params = req.query;

	readdir(uploadsDir, (err, files) => {
		if (err) {
			console.error('Error reading public/uploads directory:', err);
			return res.status(500).json({ error: 'Error reading files' });
		}

		const filePromises = files.map((filename) => {
			return new Promise((resolve, reject) => {
				const filePath = path.join(uploadsDir, filename);

				stat(filePath, (err, stats) => {
					if (err) {
						reject(err);
					} else {
						resolve({
							name: filename,
							size: stats.size,
							uploadDate: stats.mtime,
							url: `http://localhost:${port}/files/${filename}`,
						});
					}
				});
			});
		});

		Promise.all(filePromises)
			.then((fileDetails) => {
				res.json({
					files: params.query
						? fileDetails.filter((file) => file.name.includes(params.query))
						: fileDetails,
					count: fileDetails.length,
				});
			})
			.catch((err) => {
				console.error('Error getting file details:', err);
				res.status(500).json({ error: 'Error getting file details' });
			});
	});
});

app.delete('/files/:filename', (req, res) => {
	const filename = req.params.filename;
	const filePath = path.join(__dirname, 'public/uploads', filename);

	if (!existsSync(filePath)) {
		return res.status(404).json({ error: 'File not found' });
	}

	try {
		unlinkSync(filePath);
		res.status(200).json({ message: `${filename} successfully deleted.` });
	} catch (error) {
		res.json({ error });
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
