import { googleDriveConfig } from './config.js';

let gapiLoaded = false;
let googleAuth;

export async function initDriveClient() {
	if (gapiLoaded) return;
	await loadScript('https://apis.google.com/js/api.js');
	await new Promise(resolve => window.gapi.load('client:auth2', resolve));
	await window.gapi.client.init({
		discoveryDocs: googleDriveConfig.discoveryDocs,
		apiKey: googleDriveConfig.apiKey,
		clientId: googleDriveConfig.clientId,
		scope: googleDriveConfig.scope
	});
	googleAuth = window.gapi.auth2.getAuthInstance();
	gapiLoaded = true;
}

export async function ensureDriveSignedIn() {
	await initDriveClient();
	if (!googleAuth.isSignedIn.get()) {
		await googleAuth.signIn();
	}
}

export async function uploadFileToDrive(file, { folderId } = {}) {
	await ensureDriveSignedIn();
	const metadata = {
		name: file.name,
		mimeType: file.type || 'application/octet-stream',
		parents: folderId ? [folderId] : undefined
	};
	const accessToken = window.gapi.auth.getToken().access_token;
	const form = new FormData();
	form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
	form.append('file', file);
	const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink', {
		method: 'POST',
		headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
		body: form
	});
	if (!res.ok) throw new Error('Upload ke Drive gagal');
	const data = await res.json();
	// Set file to public readable
	await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + accessToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ role: 'reader', type: 'anyone' })
	});
	return {
		id: data.id,
		webViewLink: data.webViewLink,
		webContentLink: data.webContentLink,
		directLink: `https://drive.google.com/uc?export=download&id=${data.id}`
	};
}

function loadScript(src) {
	return new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = src;
		s.onload = resolve;
		s.onerror = reject;
		document.head.appendChild(s);
	});
}


