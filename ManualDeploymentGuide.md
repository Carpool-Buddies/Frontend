# Manual Deployment Guide for Frontend Repository

## Prerequisites

- Ensure you have access to the server.
- Ensure you have the necessary permissions to deploy the application.
- Ensure the VPN connection is established if required.

## Step 0: Connect to the Server

Before starting the deployment process, ensure you are connected to the server. If you are working from home, connect to the VPN first. Detailed instructions for connecting to the server are provided in the "Message to students (Updated).docx" guide.

## Step 1: Pull the Latest Code

1. **Open Command Prompt as Administrator**:
   - Click on the Start button.
   - Type `cmd` in the search bar.
   - Right-click on `Command Prompt` and select `Run as administrator`.

2. **Navigate to Your Project Directory**:
   ```sh
   cd C:\Users\user\Frontend\Carpool_BGU
   ```

3. **Pull the Latest Code**:
   ```sh
   git pull origin main
   ```

## Step 2: Build the Project

1. **Install Dependencies** (if needed):
   ```sh
   npm ci
   ```

2. **Run the Build Command**:
   ```sh
   npm run build
   ```

## Step 3: Copy the Build to IIS Directory

1. **Open Command Prompt as Administrator** (if not already open):
   - Click on the Start button.
   - Type `cmd` in the search bar.
   - Right-click on `Command Prompt` and select `Run as administrator`.

2. **Stop the IIS Site (Optional)**:
   ```sh
   iisreset /stop
   ```

3. **Copy the Build Files to IIS Directory**:
   ```sh
   xcopy /E /I /Y build C:\inetpub\wwwroot
   ```
   - Replace `build` with the name of your build folder if it is different.

4. **Restart the IIS Site**:
   ```sh
   iisreset /start
   ```

## Step 4: Verify the Deployment

1. **Open a Web Browser**:
   - Navigate to `https://carpoolbuddies.cs.bgu.ac.il/`.

2. **Check for Errors**:
   - Verify that the website loads correctly.
   - Check the browser console for any errors.
   - Check the IIS logs located at `C:\inetpub\logs\LogFiles` for any issues.

## Troubleshooting

- **VPN Connection**: Ensure your VPN connection is active if required.
- **Permissions**: Verify that you have the necessary permissions to access and modify the IIS directory.
- **Logs**: Check the IIS logs for any errors or warnings.

By following this guide, you should be able to manually deploy a new version of your frontend application to your Windows server with IIS. If you encounter any issues, refer to the troubleshooting section or seek further assistance.
