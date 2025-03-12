# AI Customer Support

## Overview
This is an interactive AI Customer Support Chatbot for Headstarter AI, a platform that provides AI-powered interviews for software engineering jobs. The chatbot can converse with users on various topics but is primarily focused on providing information about Headstarter AI's services and assisting potential candidates.

## Live Demo
Deployed on AWS EC2 at: http://3.142.174.24/

## Features
- Real-time chat interface with streaming responses
- Markdown support for rich text formatting
- Responsive design for desktop and mobile devices
- AI-powered responses using GPT-4o Mini via OpenRouter

## Chatbot Capabilities
The chatbot can help with:
- Explaining how Headstarter AI's interview platform works
- Assisting with technical issues related to the interview process
- Explaining the benefits of AI-powered interviews for software engineering candidates
- Guiding users through registration and interview scheduling
- Answering questions about pricing, features, and supported programming languages
- Providing tips for preparing for software engineering interviews

## Technologies Used
- **Frontend**: React, Next.js, Material UI
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4o Mini via OpenRouter
- **Deployment**: AWS EC2
- **Markdown Rendering**: React Markdown with plugins (rehype-raw, rehype-sanitize, remark-gfm)