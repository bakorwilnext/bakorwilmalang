<div align="center">

# Bakorwil Malang

## Badan Koordinasi Wilayah III Malang - Website

**Technical Documentation**

Built with Payload CMS + Next.js + MongoDB

</div>

---

## Document Information

| Field           | Value                                          |
|-----------------|-------------------------------------------------|
| Project         | Bakorwil Malang Website                         |
| Version         | 1.0.0                                           |
| Stack           | Next.js 16 + Payload CMS 3.70 + MongoDB        |
| Node.js         | >= 20.9.0                                       |
| Package Manager | pnpm 9.x / 10.x                                |

<div style="page-break-after: always;"></div>

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Installing MongoDB](#1--installing-mongodb)
   - 3.1 [Windows](#windows)
   - 3.2 [macOS](#macos)
   - 3.3 [Linux (Ubuntu/Debian)](#linux-ubuntudebian)
   - 3.4 [Using MongoDB Atlas (Cloud)](#using-mongodb-atlas-cloud)
4. [Clone & Setup Project](#2--clone--setup-project)
5. [Configure Environment Variables](#3--configure-environment-variables)
6. [Running the Development Server](#4--running-the-development-server)
7. [Creating Your First Admin User](#5--creating-your-first-admin-user)
8. [Seed the Database (Optional)](#6--seed-the-database-optional)
9. [User Roles & Access Control](#7--user-roles--access-control)
10. [Admin Panel Guide](#8--admin-panel-guide)
    - 10.1 [Managing Pages](#81-managing-pages)
    - 10.2 [Managing Posts](#82-managing-posts-articlesnews)
    - 10.3 [Managing Agenda / Events](#83-managing-agenda--events)
    - 10.4 [Managing Internships](#84-managing-internships)
    - 10.5 [Managing Media](#85-managing-media)
    - 10.6 [Managing Categories](#86-managing-categories)
    - 10.7 [Managing Comments](#87-managing-comments)
    - 10.8 [Managing Users](#88-managing-users)
    - 10.9 [Header & Footer (Globals)](#89-header--footer-globals)
    - 10.10 [SEO Configuration](#810-seo-configuration)
    - 10.11 [Forms](#811-forms)
    - 10.12 [Redirects](#812-redirects)
    - 10.13 [Search](#813-search)
11. [Public Website Guide](#9--public-website-guide)
12. [Building for Production](#10--building-for-production)
13. [Deployment](#11--deployment)
    - 13.1 [Method A: Docker (Recommended for VPS)](#method-a--docker-recommended-for-vps)
    - 13.2 [Method B: Manual on VPS (without Docker)](#method-b--manual-on-vps-without-docker)
    - 13.3 [Method C: Vercel + MongoDB Atlas](#method-c--vercel--mongodb-atlas)
    - 13.4 [Method D: Payload Cloud](#method-d--payload-cloud)
14. [Project Structure](#project-structure)
15. [Available Scripts](#available-scripts)
16. [Troubleshooting](#troubleshooting)

<div style="page-break-after: always;"></div>

## Tech Stack

| Technology       | Version    | Description                    |
|------------------|------------|--------------------------------|
| Next.js          | 16.x       | React framework (App Router)   |
| Payload CMS      | 3.70       | Headless CMS with admin panel  |
| MongoDB          | 6.x+       | NoSQL database                 |
| Node.js          | >= 20.9.0  | JavaScript runtime             |
| pnpm             | 9.x / 10.x| Package manager                |
| TypeScript       | 5.7        | Type safety                    |
| TailwindCSS      | 3.4        | Utility-first CSS              |
| sharp            | 0.32       | Image processing               |

---

## Prerequisites

Make sure the following software is installed on your machine.

### 1. Node.js (version >= 20.9.0)

Download and install from: **https://nodejs.org/en/download**

Verify installation:

```bash
node -v
# Example output: v20.11.0
```

### 2. pnpm (version 9 or 10)

Install pnpm globally:

```bash
npm install -g pnpm
```

Verify installation:

```bash
pnpm -v
# Example output: 9.15.0
```

### 3. Git

Download from: **https://git-scm.com/downloads**

```bash
git --version
# Example output: git version 2.43.0
```

### 4. MongoDB (version 6.x or later)

See the **Installing MongoDB** section below.

<div style="page-break-after: always;"></div>

## 1 - Installing MongoDB

### Windows

**Step 1 - Download MongoDB Community Server**

- Go to: **https://www.mongodb.com/try/download/community**
- Select **Windows**, format **MSI**, then click **Download**

**Step 2 - Run the installer**

- Double-click the downloaded `.msi` file
- Choose **Complete** installation
- Check **"Install MongoDB as a Service"** (so MongoDB starts automatically on boot)
- Check **"Install MongoDB Compass"** (GUI tool for managing the database)

**Step 3 - Verify the installation**

Open a new terminal (Command Prompt / PowerShell):

```bash
mongosh
```

If successful, you will enter the MongoDB Shell. Type `exit` to quit.

**Step 4 - If `mongosh` is not found**

Add the MongoDB path to your environment variables:

```
C:\Program Files\MongoDB\Server\7.0\bin
```

Then restart your terminal.

---

### macOS

Using Homebrew (**https://brew.sh**):

```bash
# Tap the MongoDB formula
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb-community
```

Verify:

```bash
mongosh
```

---

### Linux (Ubuntu/Debian)

```bash
# Import the MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Add the repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
   https://repo.mongodb.org/apt/ubuntu \
   jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod
```

Verify:

```bash
mongosh
```

<div style="page-break-after: always;"></div>

### Using MongoDB Atlas (Cloud)

If you do not want to install MongoDB locally, use MongoDB Atlas (free for the M0 tier).

**Step 1** - Go to **https://www.mongodb.com/atlas** and create an account.

**Step 2** - Create a **New Cluster** (select the **M0 Free** tier).

**Step 3** - Under **Security**:

- Create a **Database User** (note down the username and password).
- In **Network Access**, add your IP address (or `0.0.0.0/0` for access from anywhere).

**Step 4** - Click **Connect**, then **Connect your application**.

**Step 5** - Copy the **connection string**. It will look like this:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
  bakorwil-payload?retryWrites=true&w=majority
```

**Step 6** - Use this connection string as the `DATABASE_URI` value in your `.env` file.

<div style="page-break-after: always;"></div>

## 2 - Clone & Setup Project

```bash
# Clone the repository
git clone https://github.com/your-username/bakorwilmalang.git

# Navigate to the project folder
cd bakorwilmalang

# Copy the environment variables template
cp .env.example .env

# Install all dependencies
pnpm install
```

**Note for Windows:** If `cp` is not available, you can copy the file manually or use PowerShell:

```powershell
Copy-Item .env.example .env
```

---

## 3 - Configure Environment Variables

Open the `.env` file with a text editor and fill in the values:

```env
# MongoDB Connection (Local)
DATABASE_URI=mongodb://127.0.0.1/bakorwil-payload

# MongoDB Connection (Atlas) - uncomment to use:
# DATABASE_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/
#   bakorwil-payload?retryWrites=true&w=majority

# Secret key for JWT
# Generate at: https://generate-secret.vercel.app/32
PAYLOAD_SECRET=replace-with-your-random-secret-key

# Server URL (no trailing slash)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Secret for cron jobs
CRON_SECRET=replace-with-your-random-cron-secret

# Secret for preview
PREVIEW_SECRET=replace-with-your-random-preview-secret
```

### How to Generate a Secret Key

Use one of the following methods to generate a random secret:

```bash
# Using Node.js
node -e "console.log(
  require('crypto').randomBytes(32).toString('hex')
)"

# Using openssl (macOS/Linux)
openssl rand -hex 32
```

<div style="page-break-after: always;"></div>

## 4 - Running the Development Server

Make sure MongoDB is running, then:

```bash
pnpm dev
```

Open your browser and go to:

| URL                              | Description          |
|----------------------------------|----------------------|
| `http://localhost:3000`          | Website (frontend)   |
| `http://localhost:3000/admin`    | Admin Panel (CMS)    |

**First time running?** Payload will automatically create the collections in MongoDB. Continue to the next step to create an admin user.

---

## 5 - Creating Your First Admin User

1. Open `http://localhost:3000/admin` in your browser.
2. You will be redirected to the **Create First User** page.
3. Fill in the form:
   - **Email** - enter your admin email
   - **Password** - enter your admin password
4. Click **Create**.
5. You are now logged into the admin panel.

---

## 6 - Seed the Database (Optional)

To populate the database with sample data (pages, posts, categories):

1. Log in to the admin panel at `http://localhost:3000/admin`.
2. Click the **"Seed database"** link available on the dashboard.

**WARNING:** The seeding process will **delete all existing data** in the database and replace it with template data. Only use this for initial setup or testing.

Demo data that will be created:

| Role        | Email                        | Password   |
|-------------|------------------------------|------------|
| Demo Author | `demo-author@payloadcms.com` | `password` |

<div style="page-break-after: always;"></div>

## 7 - User Roles & Access Control

The application uses a role-based access control system with three user roles:

| Role     | Description                                                       |
|----------|-------------------------------------------------------------------|
| **Admin**  | Full access. Can create, edit, and delete all content and users. |
| **Editor** | Can create and edit content (pages, posts, agenda, internships, media, comments). Cannot delete content or manage users. |
| **User**   | Basic authenticated role. Can access the admin panel but with limited permissions. |

### Permission Matrix

| Collection    | Public (Read) | Editor (Create/Edit) | Admin (Delete) |
|---------------|:-------------:|:--------------------:|:--------------:|
| Pages         | Published only | Yes                 | Yes            |
| Posts         | All published  | Yes                 | Yes            |
| Agenda        | Published only | Yes                 | Yes            |
| Internships   | Yes            | Yes                 | Yes            |
| Media         | Yes            | Yes                 | Yes            |
| Categories    | Yes            | Yes                 | Yes            |
| Comments      | Approved only  | Yes (moderate)      | Yes            |
| Users         | No             | Read only           | Full access    |

**Important notes:**

- Only **Admin** users can create or delete other users.
- Only **Admin** users can change user roles.
- Only **Admin** users can delete content from any collection.
- Editors can create and update content but cannot delete it.
- Public visitors can only see published pages, published posts, and approved comments.

<div style="page-break-after: always;"></div>

## 8 - Admin Panel Guide

Access the admin panel at `http://localhost:3000/admin` (or your deployed URL + `/admin`).

After logging in, you will see the admin dashboard with a sidebar listing all available collections and globals.

---

### 8.1 Managing Pages

Pages are the core content of the website. Each page uses a **layout builder** system with modular blocks.

**How to create a new page:**

1. Go to **Collections** > **Pages** in the sidebar.
2. Click **Create New**.
3. Enter a **Title** (the URL slug is auto-generated from the title).
4. Configure the **Hero** section:
   - **None** - no hero section
   - **High Impact** - full-width hero with background image and text overlay
   - **Medium Impact** - hero with image and text side by side
   - **Low Impact** - simple text-only hero
   - **Custom Hero with Carousel** - hero with an image carousel slider
5. Switch to the **Content** tab and add layout blocks.
6. Configure **SEO** in the SEO tab (meta title, description, OG image).
7. Click **Save as Draft** to save without publishing, or **Publish** to make it live.

**Available layout blocks:**

| Block               | Description                                              |
|---------------------|----------------------------------------------------------|
| Content             | Rich text content with headings, paragraphs, and lists   |
| Media               | Image or video display                                   |
| Call To Action      | Highlighted section with buttons/links                   |
| Archive             | Grid display of posts with filtering                     |
| Form                | Embedded form (built with Form Builder plugin)           |
| Internships         | Displays the internship data table                       |
| Analytics           | Shows internship analytics/statistics dashboard          |
| Services            | Services showcase section                                |
| Agenda              | Displays upcoming agenda/events                          |
| Document Table      | Table display for documents                              |
| Gallery             | Image gallery with grid layout                           |
| Map                 | Embedded map display                                     |

**Draft & Publish workflow:**

- All pages support **draft mode**. Drafts are auto-saved every 100ms.
- You can **schedule publishing** for a future date/time.
- Use **Live Preview** to see changes in real time as you edit.
- Up to 50 versions per document are stored for rollback.

---

### 8.2 Managing Posts (Articles/News)

Posts are used for blog articles, news, and other time-based content.

**How to create a new post:**

1. Go to **Collections** > **Posts** in the sidebar.
2. Click **Create New**.
3. Enter a **Title**.
4. In the **Content** tab:
   - Upload a **Hero Image** (optional, displayed at the top of the post).
   - Write your content using the **Lexical rich text editor**.
   - The editor supports: headings (H1-H4), bold, italic, links, lists, images, code blocks, banners, horizontal rules, and embedded media blocks.
5. In the **Meta** tab:
   - Add **Related Posts** (shown at the bottom of the article).
   - Assign **Categories** to organize the post.
6. In the **SEO** tab:
   - Configure meta title, description, and OG image.
   - Use the **Generate** button to auto-generate SEO fields from the post title.
7. In the **sidebar**:
   - Set **Published At** date.
   - Assign **Authors** (linked to user accounts).
   - View the **View Count** (read-only, auto-tracked).
8. Click **Save as Draft** or **Publish**.

**Features:**

- Supports **draft previews** and **live preview**.
- **Scheduled publishing** - set a future date to automatically publish.
- **View count tracking** - each post tracks the number of views.
- **On-demand revalidation** - published changes are reflected on the website immediately.

---

### 8.3 Managing Agenda / Events

The Agenda collection stores events and calendar entries.

**How to create a new event:**

1. Go to **Collections** > **Agenda** in the sidebar.
2. Click **Create New**.
3. Fill in the fields:
   - **Title** - name of the event (required)
   - **Description** - details about the event
   - **Start Date** - event start date and time (required)
   - **End Date** - event end date and time
   - **Location** - where the event takes place
4. Click **Save as Draft** or **Publish**.

**Features:**

- Supports **draft/publish** workflow with autosave.
- Date fields include both date and time pickers.
- Events are displayed on the public website through the Agenda Block.

---

### 8.4 Managing Internships

The Internships collection manages intern records with automatic status tracking.

**How to add an intern:**

1. Go to **Collections** > **Internships** in the sidebar.
2. Click **Create New**.
3. Fill in the required fields:
   - **Full Name** - intern's full name
   - **School/Campus Origin** - the university or institution
   - **Faculty** - the intern's faculty
   - **Study Program (Prodi)** - the specific study program
   - **Internship Start Date** - when the internship begins
   - **Internship End Date** - when the internship ends (must be after start date)
4. Fill in optional fields:
   - **Acceptance Letter** - upload a PDF or provide an external link
   - **Department/Division** - which department the intern is assigned to
   - **Supervisor Name** - the intern's supervisor
   - **Contact Email** and **Contact Phone**
   - **Additional Notes**
5. Click **Save**.

**Automatic status calculation:**

The **Internship Status** field is automatically calculated based on the dates:

| Condition                        | Status      |
|----------------------------------|-------------|
| Current date is before start date | Upcoming   |
| Current date is between start and end | Current |
| Current date is after end date   | Completed   |

**For completed internships**, additional fields become available:

- **Performance Rating** (1-5 scale)
- **Completion Certificate** (upload)

---

### 8.5 Managing Media

The Media collection handles all file uploads (images, documents, videos).

**How to upload media:**

1. Go to **Collections** > **Media** in the sidebar.
2. Click **Create New**.
3. Drag and drop or click to upload a file.
4. Add an **Alt Text** (for accessibility and SEO).
5. Add a **Caption** (optional, supports rich text).
6. Click **Save**.

**Automatic image processing:**

When an image is uploaded, the following sizes are automatically generated:

| Size Name  | Width   | Height  | Format |
|------------|---------|---------|--------|
| thumbnail  | 300px   | 300px   | WebP   |
| square     | 500px   | 500px   | WebP   |
| small      | 600px   | auto    | WebP   |
| medium     | 900px   | auto    | WebP   |
| large      | 1400px  | auto    | WebP   |
| xlarge     | 1920px  | auto    | WebP   |
| og         | 1200px  | 630px   | WebP   |

**Features:**

- **Focal point** selection - choose the important area of the image for cropping.
- **Manual resizing** - adjust image dimensions as needed.
- All images are optimized with WebP format for fast loading.
- The "og" size is specifically for Open Graph / social media sharing.

---

### 8.6 Managing Categories

Categories are used to organize posts into groups.

**How to create a category:**

1. Go to **Collections** > **Categories** in the sidebar.
2. Click **Create New**.
3. Enter a **Title** (the slug is auto-generated).
4. Click **Save**.

**Features:**

- Categories support **nesting** (e.g., "News > Technology") via the Nested Docs plugin.
- Categories are auto-slugified for use in URLs.

---

### 8.7 Managing Comments

Comments are submitted by public visitors on posts and require moderation.

**How to moderate comments:**

1. Go to **Collections** > **Comments** in the sidebar.
2. You will see a list of comments with columns: Author Name, Post, Status, Created At.
3. Click on a comment to view its details.
4. In the **sidebar**, change the **Status**:
   - **Pending** - default status for new comments (not visible on website)
   - **Approved** - comment becomes visible on the website
   - **Rejected** - comment is hidden from the website
5. Click **Save**.

**Comment fields:**

- **Post** - the post the comment belongs to
- **Author Name** - the commenter's name
- **Author Email** - the commenter's email
- **Comment (Body)** - the comment text
- **Reply To** - if the comment is a reply to another comment (threaded comments)

**Important:** Only approved comments are visible to public visitors. All new comments start as "Pending" and require admin/editor moderation.

---

### 8.8 Managing Users

**Admin only.** Only users with the Admin role can create, edit, or delete user accounts.

**How to create a new user:**

1. Go to **Collections** > **Users** in the sidebar.
2. Click **Create New**.
3. Fill in:
   - **Name** - display name
   - **Email** - login email (required, must be unique)
   - **Password** - login password
   - **Roles** - assign one or more roles: Admin, Editor, or User
4. Click **Save**.

**Important:** The roles field is protected - only Admin users can change roles. If an editor tries to change their own role, the change will be blocked.

---

### 8.9 Header & Footer (Globals)

Globals are site-wide settings that appear on every page.

**Editing the Header:**

1. Go to **Globals** > **Header** in the sidebar.
2. Upload a **Logo** image (optional, falls back to default if not set).
3. Add **Navigation Items** (up to 6):
   - Each nav item has a **Link** (label + URL or internal page reference).
   - Enable **Has Dropdown** to add sub-navigation items (up to 10 per dropdown).
4. Click **Save**.

**Editing the Footer:**

1. Go to **Globals** > **Footer** in the sidebar.
2. Add **Navigation Items** (up to 6 footer links).
3. Edit **Contact Information**:
   - Address, Email, Phone, Fax
4. Edit **Social Media Links**:
   - YouTube, Twitter, Facebook, Instagram URLs
5. Add **Partner Logos** (up to 10):
   - Upload logo image, set name, and optional link URL.
6. Click **Save**.

**Note:** Changes to Header and Footer are automatically revalidated on the frontend via on-demand revalidation.

---

### 8.10 SEO Configuration

Every Page and Post has a dedicated **SEO** tab with the following fields:

| Field            | Description                                          |
|------------------|------------------------------------------------------|
| Meta Title       | The page title shown in search engine results        |
| Meta Description | The description shown in search engine results       |
| Meta Image       | The OG image used when sharing on social media       |
| Preview          | A preview of how the page will appear in search results |

**Tips:**

- Use the **Generate** button to auto-populate the meta title from the page/post title.
- The auto-generated title format is: "Page Title | Situs Resmi Bakorwil III Malang".
- A sitemap is automatically generated at `/sitemap.xml` after each build.
- A `robots.txt` is auto-generated, blocking `/admin/*` from search engines.

---

### 8.11 Forms

The Form Builder plugin allows you to create custom forms without code.

**How to create a form:**

1. Go to **Collections** > **Forms** in the sidebar.
2. Click **Create New**.
3. Enter a **Title** for the form.
4. Add **Fields** - available field types include:
   - Text, Textarea, Email, Number, Select, Checkbox
   - PDF Upload (custom field for file submissions)
5. Set a **Confirmation Message** (shown after successful submission).
6. Click **Save**.
7. To embed the form on a page, add a **Form Block** to any page layout.

---

### 8.12 Redirects

The Redirects plugin lets you create URL redirects for migrated or moved content.

**How to create a redirect:**

1. Go to **Collections** > **Redirects** in the sidebar.
2. Click **Create New**.
3. Set the **From** URL (the old path).
4. Set the **To** destination (a page, post, or custom URL).
5. Click **Save**.

**Note:** After creating or changing a redirect, the website needs to be rebuilt for the redirect to take effect.

---

### 8.13 Search

The Search plugin indexes posts for the website search functionality.

- Search is automatically synced when posts are created, updated, or deleted.
- The search index is stored in a separate `search` collection.
- Only the **Posts** collection is indexed for search.

No manual configuration is needed - the search index updates automatically.

<div style="page-break-after: always;"></div>

## 9 - Public Website Guide

This section describes what public visitors (non-logged-in users) can do on the website.

### Browsing Pages

- The homepage is accessible at the root URL (`/`).
- Other pages are accessible at `/<page-slug>` (e.g., `/about`, `/contact`).
- Pages display the hero section at the top, followed by the layout blocks configured by the admin.

### Reading Posts (Articles/News)

- The posts listing page is accessible at `/posts`.
- Posts support **pagination** - navigate between pages using page controls.
- Click on any post to read the full article at `/posts/<post-slug>`.
- Each post page displays:
   - Hero image (if set)
   - Post title, author(s), published date, and categories
   - Full article content
   - Related posts (if configured)

### Viewing the Agenda

- The agenda page is accessible at `/agenda`.
- Events are displayed in a calendar or list view.
- Events show the title, date/time, location, and description.

### Searching Content

- The search page is accessible at `/search`.
- Type a query to search through all published posts.
- Results are displayed with the post title, description, and link.

### Submitting Comments

- On any post page, visitors can submit a comment.
- Required fields: **Name**, **Email**, and **Comment text**.
- Submitted comments start with **Pending** status and are not immediately visible.
- Comments become visible only after an admin or editor approves them.
- Threaded replies are supported (replying to existing comments).

### Submitting Forms

- Pages that include a Form Block display an interactive form.
- Visitors can fill in the fields and submit the form.
- After submission, a confirmation message is displayed.
- Form submissions are stored in the admin panel under **Form Submissions**.

### Other Public Features

- **Dark Mode** - the website supports light and dark mode.
- **Responsive Design** - the website is fully responsive for mobile, tablet, and desktop.
- **SEO Optimized** - all pages include proper meta tags, Open Graph data, and sitemap.
- **Sitemap** - available at `/sitemap.xml` for search engine crawlers.

<div style="page-break-after: always;"></div>

## 10 - Building for Production

### Build

```bash
pnpm build
```

This command will:

1. Run `next build` - creates a production bundle in the `.next` folder.
2. Run `next-sitemap` - generates `sitemap.xml` and `robots.txt`.

### Start the Production Server

```bash
pnpm start
```

The production server will run on port `3000` (default).

### Verify the Production Build

```bash
# Build and start immediately
pnpm dev:prod
```

<div style="page-break-after: always;"></div>

## 11 - Deployment

### Method A - Docker (Recommended for VPS)

#### Prerequisites

- Docker: **https://docs.docker.com/get-docker/**
- Docker Compose: **https://docs.docker.com/compose/install/**

#### Steps

**Step 1** - Make sure your `.env` file is configured (see Section 3).

For Docker deployment, change `DATABASE_URI` to point to the MongoDB container:

```env
DATABASE_URI=mongodb://mongo:27017/bakorwil-payload
```

**Step 2** - Add `output: 'standalone'` to `next.config.js`:

```js
const nextConfig = {
  output: 'standalone',
  // ... other configuration
}
```

**Step 3** - Run with Docker Compose:

```bash
docker-compose up -d
```

This will:
- Start a MongoDB container on port `27017`
- Start the application container on port `3000`

**Step 4** - Check container status:

```bash
docker-compose ps
```

**Step 5** - View logs:

```bash
docker-compose logs -f payload
```

**Step 6** - Stop all containers:

```bash
docker-compose down
```

<div style="page-break-after: always;"></div>

#### Docker Compose Reference (`docker-compose.yml`)

```yaml
version: '3'

services:
  payload:
    image: node:18-alpine
    ports:
      - '3000:3000'
    volumes:
      - .:/home/node/app
      - node_modules:/home/node/app/node_modules
    working_dir: /home/node/app/
    command: sh -c "yarn install && yarn dev"
    depends_on:
      - mongo
    env_file:
      - .env

  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    command:
      - --storageEngine=wiredTiger
    volumes:
      - data:/data/db
    logging:
      driver: none

volumes:
  data:
  node_modules:
```

#### Docker Production Build

For production, use the included `Dockerfile`:

```bash
# Build the image
docker build -t bakorwil-malang .

# Run the container
docker run -d \
  --name bakorwil-app \
  -p 3000:3000 \
  --env-file .env \
  bakorwil-malang
```

**Important:** The Dockerfile requires `output: 'standalone'` in `next.config.js`.

<div style="page-break-after: always;"></div>

### Method B - Manual on VPS (without Docker)

Suitable for VPS providers like DigitalOcean Droplet, Hetzner, Contabo, AWS EC2, etc.

#### Step 1 - Server Setup

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x \
  | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MongoDB
# (see the Linux installation section above)
```

#### Step 2 - Clone & Setup

```bash
# Clone the repository
git clone \
  https://github.com/your-username/bakorwilmalang.git \
  /var/www/bakorwil

# Navigate to the folder
cd /var/www/bakorwil

# Setup environment
cp .env.example .env
nano .env   # Edit as needed

# Install dependencies
pnpm install

# Build
pnpm build
```

#### Step 3 - Use PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start pnpm --name "bakorwil" -- start

# Set PM2 to auto-start on server reboot
pm2 startup
pm2 save
```

Useful PM2 commands:

| Command                  | Description                |
|--------------------------|----------------------------|
| `pm2 status`             | Check application status   |
| `pm2 logs bakorwil`      | View logs                  |
| `pm2 restart bakorwil`   | Restart the application    |
| `pm2 stop bakorwil`      | Stop the application       |
| `pm2 delete bakorwil`    | Remove from PM2            |

<div style="page-break-after: always;"></div>

#### Step 4 - Setup Nginx as a Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y
```

Create the Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/bakorwil
```

Paste the following:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For
          $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
# Create a symlink
sudo ln -s \
  /etc/nginx/sites-available/bakorwil \
  /etc/nginx/sites-enabled/

# Remove the default config (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test the configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 5 - Setup SSL with Certbot (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate SSL certificate
sudo certbot --nginx \
  -d yourdomain.com \
  -d www.yourdomain.com

# Auto-renewal is configured automatically
```

After SSL is active, update your `.env`:

```env
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
```

Then rebuild and restart:

```bash
pnpm build
pm2 restart bakorwil
```

<div style="page-break-after: always;"></div>

### Method C - Vercel + MongoDB Atlas

#### Step 1 - Setup MongoDB Atlas

Follow the steps in the **Using MongoDB Atlas (Cloud)** section above.

#### Step 2 - Deploy to Vercel

1. Push your code to GitHub.
2. Go to **https://vercel.com** and import the repository.
3. Add the following **Environment Variables** in the Vercel dashboard:

| Variable                 | Value                                     |
|--------------------------|-------------------------------------------|
| `DATABASE_URI`           | Atlas connection string (`mongodb+srv://...`) |
| `PAYLOAD_SECRET`         | Random secret key                         |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-project.vercel.app`         |
| `CRON_SECRET`            | Random secret key                         |
| `PREVIEW_SECRET`         | Random secret key                         |
| `BLOB_READ_WRITE_TOKEN`  | (optional, from Vercel Blob Storage)      |

4. Click **Deploy**.

#### Vercel Blob Storage (Optional)

To store media uploads in Vercel Blob Storage:

1. Open Vercel Dashboard, then go to Project, then **Storage**, then **Blob**.
2. Create a new Blob store.
3. Copy the `BLOB_READ_WRITE_TOKEN` to your environment variables.
4. Redeploy.

**Note:** The application is already configured to use Vercel Blob Storage automatically when `BLOB_READ_WRITE_TOKEN` is available.

---

### Method D - Payload Cloud

The easiest way to deploy:

1. Go to **https://payloadcms.com/new/import**
2. Connect your GitHub repository.
3. Payload Cloud will automatically detect the configuration.
4. Deploy.

<div style="page-break-after: always;"></div>

## Project Structure

```
bakorwilmalang/
|-- public/                  Static assets (images, fonts, etc.)
|   |-- media/               Uploaded media (auto-generated)
|
|-- src/
|   |-- app/                 Next.js App Router pages & layouts
|   |-- blocks/              Layout builder blocks
|   |-- collections/         Payload collections
|   |   |-- Agenda/            Agenda collection
|   |   |-- Categories.ts      Categories collection
|   |   |-- Comments.ts        Comments collection
|   |   |-- Internships.ts     Internships collection
|   |   |-- Media.ts           Media collection (uploads)
|   |   |-- Pages/             Pages collection
|   |   |-- Posts/             Posts collection (articles/news)
|   |   |-- Users/             Users collection
|   |-- components/          React components
|   |-- fields/              Custom Payload fields
|   |-- Footer/              Footer global config
|   |-- Header/              Header global config
|   |-- heros/               Hero section components
|   |-- hooks/               Custom hooks
|   |-- plugins/             Payload plugins config
|   |-- providers/           React context providers
|   |-- search/              Search configuration
|   |-- utilities/           Helper functions
|   |-- payload.config.ts    Main Payload configuration
|
|-- tests/                   Test files
|-- .env                     Environment variables (do not commit!)
|-- .env.example             Environment variables template
|-- docker-compose.yml       Docker Compose configuration
|-- Dockerfile               Docker build configuration
|-- next.config.js           Next.js configuration
|-- tailwind.config.mjs      TailwindCSS configuration
|-- tsconfig.json            TypeScript configuration
|-- package.json             Dependencies & scripts
```

<div style="page-break-after: always;"></div>

## Available Scripts

| Script             | Command                    | Description                              |
|--------------------|----------------------------|------------------------------------------|
| Dev                | `pnpm dev`                 | Start the development server             |
| Build              | `pnpm build`               | Build for production + generate sitemap  |
| Start              | `pnpm start`               | Start the production server              |
| Dev Prod           | `pnpm dev:prod`            | Rebuild & start production               |
| Lint               | `pnpm lint`                | Check code style with ESLint             |
| Lint Fix           | `pnpm lint:fix`            | Auto-fix code style                      |
| Test               | `pnpm test`                | Run all tests                            |
| Test Unit          | `pnpm test:int`            | Run integration tests (Vitest)           |
| Test E2E           | `pnpm test:e2e`            | Run E2E tests (Playwright)              |
| Generate Types     | `pnpm generate:types`      | Generate TypeScript types from Payload   |
| Generate ImportMap | `pnpm generate:importmap`  | Generate Payload import map              |

<div style="page-break-after: always;"></div>

## Troubleshooting

### Problem: `mongosh` / `mongo` command not found

**Cause:** MongoDB is not installed or not added to PATH.

**Solution:** See the **Installing MongoDB** section.

---

### Problem: `MongoServerError: connection refused`

**Cause:** The MongoDB service is not running.

**Solution:**

```bash
# Windows (PowerShell as Administrator)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

### Problem: `Error: Cannot find module 'sharp'`

**Solution:**

```bash
pnpm install sharp
```

---

### Problem: `EACCES: permission denied` during install

**Solution:**

```bash
# Use the --ignore-workspace flag
pnpm --ignore-workspace install
```

---

### Problem: Port 3000 is already in use

**Solution:**

```bash
# Find the process using port 3000

# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Or run on a different port
PORT=3001 pnpm dev
```

---

### Problem: Build error - `out of memory`

**Solution:** Add a memory limit for Node.js:

```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

### Problem: MongoDB connection timeout on Atlas

**Possible causes and solutions:**

- Make sure your IP address is added in **Network Access** on MongoDB Atlas.
- Check that the connection string is correct (username, password, database name).
- Ensure no firewall is blocking the connection.

---

## License

MIT License - see the LICENSE file for details.

---

<div align="center">

*End of Document*

</div>
