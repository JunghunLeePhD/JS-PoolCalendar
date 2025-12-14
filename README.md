# 🏊 Fukuoka West Pool Calendar Bot

An automated tool that scrapes the monthly schedule PDF from the [Fukuoka City Comprehensive West Civic Pool website](https://www.sports-fukuokacity.or.jp/facility/pool_nishi.html), extracts event data using Google's **Gemini 2.5 AI**, and generates an `.ics` calendar file for subscription.

Designed to run automatically via **GitHub Actions** or inside a **Dev Container**.

## ✨ Features

* **Auto-Download:** Fetches the latest schedule PDF from the facility's website.
* **AI Extraction:** Uses `gemini-2.5-flash-lite` to accurately parse complex visual tables (handling holidays, partial closures, and swim meets).
* **iCal Generation:** Outputs a standard `.ics` file compatible with Apple Calendar, Google Calendar, and Outlook.
* **Automation:** Runs on the 1st of every month using GitHub Actions.
* **Dev Container Ready:** Includes a pre-configured Docker environment for consistent development.

## 📂 Project Structure

```text
pool-calendar-bot/
├── .devcontainer/       # Docker configuration for VS Code
├── .github/workflows/   # GitHub Actions automation script
├── src/
│   ├── index.js         # Main controller
│   ├── 1_download.js    # PDF fetcher
│   ├── 2_analyze.js     # Gemini AI extraction logic
│   └── 3_generate.js    # ICS generator
├── package.json         # Dependencies
└── README.md
```

## **🚀 Getting Started**

### **Prerequisites**

- **Node.js** (v20+)


- A **Google Gemini API Key** (Get one [here](https://aistudio.google.com/))



### **Option A: Using VS Code Dev Containers (Recommended)**

1. Open this folder in VS Code.


1. Click **"Reopen in Container"** when prompted (or use the Command Palette: `Dev Containers: Reopen in Container`).


1. Once the container builds, the environment is ready.



### **Option B: Local Installation**

1. Clone the repository:

Bash

```
git clone [https://github.com/JunghunLeePhD/JS-PoolCalendar](https://github.com/JunghunLeePhD/JS-PoolCalendar)
cd JS-PoolCalendar
```





1. Install dependencies:


```bash
npm install
```






## **⚙️ Usage**

To run the bot manually, you must provide your Gemini API key as an environment variable.

**Linux/Mac/Dev Container:**


```bash
export GEMINI_API_KEY="your_api_key_here"
npm start
```




**Windows (PowerShell):**


```PowerShell
$env:GEMINI_API_KEY="your_api_key_here"
npm start
```




The script will:

1. Download `schedule.pdf`.


2. Generate `events.json` using AI.


3. Create `pool_schedule.ics`.



## **🤖 GitHub Actions Automation**

This repository is configured to run automatically on the **1st of every month**. To enable this:

1. Go to your GitHub Repository **Settings**.


2. Navigate to **Secrets and variables** > **Actions**.


3. Click **New repository secret**.


4. **Name:** `GEMINI_API_KEY`


5. **Value:** (Paste your Google AI Studio API Key)


6. Click **Add secret**.



The workflow (`.github/workflows/calendar_bot.yml`) will now run automatically.

## **📅 How to Subscribe to the Calendar**

Once the GitHub Action runs successfully:

1. Navigate to the `pool_schedule.ics` file in your repository.


2. Click the **"Raw"** button to get the direct file URL.

- *URL format:* `https://raw.githubusercontent.com/<username>/<repo>/main/pool_schedule.ics`




3. **Subscribe** in your calendar app:

- **Apple Calendar:** File > New Calendar Subscription > Paste URL.


- **Google Calendar:** Settings > Add calendar > From URL.





## **🛠️ Configuration**

You can customize the AI model in `src/2_analyze.js`. The default is set to the latest efficient vision model:


```JavaScript
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
```




## **📄 License**

This project is licensed under the MIT License.