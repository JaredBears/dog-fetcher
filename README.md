# Dog Fetcher

Dog Fetcher is a React.js Application that will allow users to search and retrieve dog listings, and then find an individual matching dog for companionship.

## Run

You can either utilize this app [here](https://dog-fetcher-jaredbears.vercel.app/) or follow the below steps to run a local version:

1. Setup Node.js Dev Environment using NVM
2. Clone the repository 
    ```
    git clone https://github.com/JaredBears/dog-fetcher.git
    ```
3. Navigate to the project directory
4. Load All Dependencies
    ```
    npm install
    ```
5. Start the local server with https access.
    * Windows (Powershell)
        ```
        ($env:HTTPS = "true") -and (npm start)
        ```
    * Windows (cmd.exe)
        ```
        set HTTPS=true&&npm start
        ```
    * Linux, macOS (Bash)
        ```
        HTTPS=true npm start
        ```

## Usage

1. The user will first be required to login with a name and an email address.
2. Once the user is logged in, they can choose between browsing all dogs and utilizing an advanced search.
	* All fields under the advanced search are optional
3. Once the search has been ran, the user will have the option to save/remove individual dogs to their favorites.
4. Once the user has added at least one dog to their favorites, they can "Find Match" which will return the an individual dog for companionship!