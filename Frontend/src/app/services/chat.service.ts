import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface ChatResponse {
    response: string | any;
    mode: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = 'http://192.168.3.4:9015/smart-chat-router-ladki-bahin';

    constructor(private http: HttpClient) { }

    sendMessage(
        message: string,
        sessionId: string,
        prevRes: string | null = null,
        prevResMode: string | null = null,
        file: File | null = null,
        docType: string | null = null
    ): Observable<ChatResponse | any> {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('session_id', sessionId);

        if (prevRes) {
            formData.append('prev_res', prevRes);
        }

        if (prevResMode) {
            formData.append('prev_res_mode', prevResMode);
        }

        if (file) {
            formData.append('file', file);
        }

        if (docType) {
            formData.append('doc_type', docType);
        }

        return this.http.post<ChatResponse>(this.apiUrl, formData);
    }

    // Use the key directly in frontend as requested for performance (Note: In production, use backend proxy or secure handling)
    private googleApiKey = environment.googleApiKey;
    private ttsApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

    getAudio(text: string): Observable<any> {
        const url = `${this.ttsApiUrl}?key=${this.googleApiKey}`;
        const payload = {
            "contents": [{
                "parts": [{ "text": `Say cheerfully: ${text}` }]
            }],
            "generationConfig": {
                "responseModalities": ["AUDIO"],
                "speechConfig": {
                    "voiceConfig": {
                        "prebuiltVoiceConfig": {
                            "voiceName": "Aoede"
                        }
                    }
                }
            }
        };
        return this.http.post(url, payload);
    }
}
