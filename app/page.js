"use client";
import {Box, Stack, TextField, Button, Typography} from "@mui/material";
import Image from "next/image";
import {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "# Welcome to AI Customer Support!\n\nHello! I'm the **Headstarter AI assistant**. I can help you with:\n\n- Answering questions\n- Providing information\n- Having conversations\n\nHow can I help you today? 🤖",
  }]);
  
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setMessage('');
    setMessages((messages) => [
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: ""},
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, {role: "user", content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true});
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });

        return reader.read().then(processText);
      });
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ 
        background: 'var(--background-color)',
        color: 'var(--text-color)',
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          mb: 4, 
          color: 'var(--primary-color)',
          textShadow: '2px 2px 0px var(--secondary-color), 4px 4px 0px rgba(0,0,0,0.2)',
          fontSize: '2.5rem',
          textAlign: 'center',
          padding: '0.5rem',
        }}
      >
        AI CUSTOMER SUPPORT
      </Typography>
      
      <Stack 
        direction="column"
        width="600px"
        height="600px"
        border="2px solid var(--primary-color)"
        borderRadius="8px"
        p={3}
        spacing={3}
        sx={{
          background: 'var(--surface-color)',
          boxShadow: '0 0 15px var(--primary-color), inset 0 0 10px rgba(123, 104, 238, 0.2)',
        }}
      >
        <Stack 
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{ 
            p: 1,
          }}
        >
          {
            messages.map((message, index) => (
            <Box 
              key={index} 
              display="flex" 
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box 
                bgcolor={
                  message.role === "assistant" 
                  ? "var(--primary-color)" 
                  : "var(--secondary-color)"
                }
                color="var(--text-color)"
                borderRadius="8px"
                p={2}
                sx={{ 
                  maxWidth: '80%',
                  fontSize: '0.8rem',
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                  border: '2px solid var(--border-color)',
                  '& .markdown': {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  },
                  '& a': {
                    color: '#ffffff',
                    textDecoration: 'underline',
                  },
                  '& code': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '3px',
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                  },
                  '& pre': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    overflowX: 'auto',
                    border: '1px solid var(--border-color)',
                  },
                  '& pre code': {
                    backgroundColor: 'transparent',
                    padding: 0,
                  },
                  '& blockquote': {
                    borderLeft: '3px solid var(--text-color)',
                    paddingLeft: '0.5rem',
                    margin: '0.5rem 0',
                  },
                  '& ul, & ol': {
                    paddingLeft: '1.5rem',
                    marginBottom: '0.5rem',
                  },
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    margin: '0.5rem 0',
                  },
                  '& table': {
                    borderCollapse: 'collapse',
                    width: '100%',
                    marginBottom: '0.5rem',
                  },
                  '& th, & td': {
                    border: '1px solid var(--border-color)',
                    padding: '0.25rem',
                    textAlign: 'left',
                  },
                  '& hr': {
                    border: 'none',
                    borderBottom: '1px solid var(--border-color)',
                    margin: '0.5rem 0',
                  },
                }}
                className="markdown"
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                >
                  {message.content}
                </ReactMarkdown>
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack 
          direction="row"
          spacing={2}
        >
          <TextField
            label="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'var(--text-color)',
                borderColor: 'var(--border-color)',
                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                '&:hover fieldset': {
                  borderColor: 'var(--primary-color)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--primary-color)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-color)',
                '&.Mui-focused': {
                  color: 'var(--primary-color)',
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSendMessage}
            sx={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--text-color)',
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '0.7rem',
              padding: '0.5rem 1rem',
              '&:hover': {
                backgroundColor: 'var(--secondary-color)',
              },
              border: '2px solid var(--border-color)',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
            }}
          >
            SEND
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
