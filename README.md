# Dauntless Leaderboards

Project used for https://dauntless-leaderboards.com
Join our community on [Discord](https://discord.gg/JGTVcqMDfm)

## How to use

Versions used:
- Node 18.16.0
- Npm 9.5.1

Clone or Fork the project
`git clone `
`cd Dauntless-Leaderboards`

### Server
`cd server`

Create a `.env` file by using `example.env` as a template

Install server dependencies
`npm i`

Start the Express server
`npm run server`

Start the Gauntlets scrap
`npm run gauntlets`

Start the Trials scrap (Use with causion as it store in huge JSON file and it may kill your RAM 🤷‍♂️)
- `npm run trials` will fetch the current trial week every 10 minutes
- `npm run trials last` will fetch the last week trial
- `npm run trials all` will fetch every weeks

### Client
`cd client`

Install server dependencies
`npm i`

Dev mode
`npm run start`

## How to Contribute

You can use the `suggestions` and `bug-reports` form on our [Discord](https://discord.gg/JGTVcqMDfm)

## Contributor

- n1ck0 & themero: Base idea of collecting Gauntlet data to create Bar Chart Race
- macvilla: First one to trust and support this project and help formatting and understanding Gauntlet data
- superevilteam: Figured out and share how to get trials data
- thepikeofdestiny: For his all behemoth rotation Google sheet