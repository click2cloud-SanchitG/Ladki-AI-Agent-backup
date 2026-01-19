import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  type?: 'text' | 'image' | 'file';
  file?: File;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  showPassword: boolean = false;
  liveChat: boolean = false;
  expandChatWindow: boolean = false;

  // Chat properties
  messages: ChatMessage[] = [];
  userMessage: string = '';
  sessionId: string = '';
  prevRes: string | null = null;
  prevResMode: string | null = null;
  isLoading: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  documents = [
    'Aadhaar Card',
    'Domicile Certificate',
    'Birth Certificate',
    'School Leaving Certificate',
    'Income Certificate',
    'Ration Card',
    'Voter ID',
    'Letter of Guarantee',
    'Bank Passbook',
    'Photograph'
  ];

  selectedDocType = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.sessionId = this.generateSessionId();
    // specific initial greeting if needed, or wait for user interaction
    this.messages.push({
      text: "नमस्कार, मी महाराष्ट्र शासनाचा एजंटिक एआय सेवा बॉट आहे. मी तुमची लाडकी बहीण योजनेच्या माहितीसाठी आणि अर्जासाठी मदत करू शकतो. तुम्ही कशा प्रकारे मदत करू इच्छिता?",
      isUser: false
    });
    this.scrollToBottom();
  }

  generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  openUploader(doc: string) {
    this.selectedDocType = doc;
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    console.log('Document Type:', this.selectedDocType);
    console.log('Uploaded File:', file);

    // Send file immediately as a message
    this.sendUserMessage(file);

    input.value = '';
  }
  openLiveChat() {
    this.liveChat = !this.liveChat;
  }
  toggleChatWindowSize() {
    this.expandChatWindow = !this.expandChatWindow;
  }

  sendUserMessage(file: File | null = null) {
    if (!this.userMessage.trim() && !file) return;

    let messageText = this.userMessage;
    if (file) {
      messageText = `Uploaded: ${file.name} (${this.selectedDocType})`;
    }

    // Add user message to UI
    this.messages.push({
      text: messageText,
      isUser: true,
      file: file || undefined
    });

    const currentMsg = this.userMessage; // Store for API call
    this.userMessage = ''; // Clear input
    this.isLoading = true;
    this.scrollToBottom();

    this.chatService.sendMessage(
      file ? "Uploaded document" : currentMsg,
      this.sessionId,
      this.prevRes,
      this.prevResMode,
      file,
      file ? this.selectedDocType : null
    ).subscribe({
      next: (res) => {
        this.isLoading = false;

        let botText = "";
        let responseObj = res.response;

        // If response is a string, try to parse it as JSON
        if (typeof responseObj === 'string') {
          try {
            // Check if it looks like a JSON object
            if (responseObj.trim().startsWith('{')) {
              const parsed = JSON.parse(responseObj);
              responseObj = parsed;
            }
          } catch (e) {
            // Not a JSON string, treat as raw text
          }
        }

        // Now handle the object (either originally an object or parsed from string)
        if (typeof responseObj === 'object' && responseObj !== null) {
          if (responseObj.message) {
            botText = responseObj.message;
          } else if (responseObj.response) {
            // specific case: { "response": "..." }
            botText = responseObj.response;

            // Recursive check: if the inner response is also a JSON string or object
            if (typeof botText === 'string') {
              try {
                if (botText.trim().startsWith('{')) {
                  const parsedInner = JSON.parse(botText);
                  if (parsedInner.message) {
                    botText = parsedInner.message;
                  }
                }
              } catch (e) { }
            } else if (typeof botText === 'object' && (botText as any).message) {
              botText = (botText as any).message;
            }

          } else {
            // Fallback: stringify the whole object if we interpret it as unknown structure
            // But typically we should have found 'message'
            botText = JSON.stringify(responseObj);
          }
        } else {
          // It's a primitive string
          botText = String(responseObj);
        }

        this.messages.push({
          text: botText,
          isUser: false
        });

        this.scrollToBottom();

        this.prevRes = botText;
        this.prevResMode = res.mode;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Chat error:', err);
        this.messages.push({
          text: "क्षमस्व, काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
          isUser: false
        });
        this.scrollToBottom();
      }
    });
  }

  handleQuickReply(reply: string) {
    this.userMessage = reply;
    this.sendUserMessage();
  }

  resetSession() {
    this.sessionId = this.generateSessionId();
    this.prevRes = null;
    this.prevResMode = null;
    this.messages = [];
    this.isLoading = false;

    // Add reset welcome message
    this.messages.push({
      text: "सत्र रीसेट. लाडकी बहिन योजनेबाबत मी तुम्हाला कशी मदत करू शकतो?",
      isUser: false
    });
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTo({
          top: this.scrollContainer.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } catch (err) { }
  }

  currentAudio: HTMLAudioElement | null = null;
  isPlaying: boolean = false;

  
  
  playTextToSpeech(text: string) {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.isPlaying = false;
    }

    if (!text) return;

    // Clean text before sending to TTS (remove markdown, etc)
    const cleanedText = this.cleanTextForTTS(text);

    this.chatService.getAudio(cleanedText).subscribe({
      next: (response: any) => {
        try {
          const candidates = response.candidates;
          if (candidates && candidates.length > 0) {
            const parts = candidates[0].content.parts;
            if (parts && parts.length > 0) {
              const base64Data = parts[0].inlineData.data;
              const pcmData = this.base64ToUint8Array(base64Data);
              const wavData = this.addWavHeader(pcmData, 24000, 1, 16);
              const blob = new Blob([wavData as any], { type: 'audio/wav' });

              const url = URL.createObjectURL(blob);
              this.currentAudio = new Audio(url);
              this.currentAudio.play();
              this.isPlaying = true;
              this.currentAudio.onended = () => {
                this.isPlaying = false;
                this.currentAudio = null;
              };
              return;
            }
          }
          console.error("No audio data found in response");
        } catch (e) {
          console.error("Error processing audio response", e);
        }
      },
      error: (err) => {
        console.error("Audio playback error", err);
      }
    });
  }

  base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  addWavHeader(samples: Uint8Array, sampleRate: number, numChannels: number, bitDepth: number): Uint8Array {
    const blockAlign = numChannels * bitDepth / 8;
    const byteRate = sampleRate * blockAlign;
    const dataSize = samples.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + dataSize, true);
    /* RIFF type */
    this.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, byteRate, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    this.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, dataSize, true);

    // Write audio data
    const headerBytes = new Uint8Array(buffer, 0, 44);
    headerBytes.set(new Uint8Array(buffer.slice(0, 44))); // just ensuring we have the header
    // Actually we need to combine header and data.
    // Let's do it using Uint8Array set
    const wavBytes = new Uint8Array(buffer);
    wavBytes.set(samples, 44);

    return wavBytes;
  }

  writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  cleanTextForTTS(text: string): string {
    if (!text) return '';
    // Remove bold/italic markers (**text** or *text* or __text__)
    let cleaned = text.replace(/[\*_]{1,2}/g, '');
    // Remove links [text](url) -> text
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    // Remove code blocks
    cleaned = cleaned.replace(/`{1,3}[^`]*`{1,3}/g, '');
    // Remove HTML tags if any (basic)
    cleaned = cleaned.replace(/<[^>]*>/g, '');

    return cleaned.trim();
  }
  formatMessage(text: string): string {
    if (!text) return '';
    let formatted = text;
    // Bold: **text** -> <b>text</b>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Newlines -> <br>
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }
}
