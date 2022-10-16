# Everything Garden

## _A place to grow... everything_

## Play

https://robbob42.github.io/bobidle/

## About

Ever wanted to plant a Bank Seed?  Have you ever wondered what would happen if you tried harvesting a Bottom Navigation Bar?  In the Everything Garden, you will advance your single, humble plot of land to a thriving farm.

## Project Overview

### JavaScript

Since I first learned about modern JavaScript frameworks, I have let them use their dark magic to take care of all the messy scaffolding with tools like [Create React App](https://create-react-app.dev/) or [ng new](https://angular.io/cli/new).  For this project, I wanted to go back to my roots and use Vanilla JS.  After a lot of [Googling](https://www.google.com/search?q=what+in+the+heck+is+webpack%3F&oq=what+in+the+heck+is+webpack%3F&aqs=chrome..69i57.4800j0j7&sourceid=chrome&ie=UTF-8), I got my Webpack config set up for SCSS and TypeScript.  Although initially frustrating, it has certainly been a breath of [fresh air](https://store.mannheimsteamroller.com/products/fresh-aire-i) remembering the freedom that comes with plain ol' JS.

### Game Engine

This game is my third go at the JavaScript idle/incremental genre, and my first time using a game engine.  I used Carribus' [Continuum Engine](https://carribus.github.io/continuum-engine/), which is a pretty lightweight JavaScript library that does a fantastic job of managing time, inventory, and of course the update() function.

### Design System

After using it exhaustively the last 3 years, I wanted to try something different from [Material Design](https://material.io/design).  I found a very elegant, sleek system with [Clarity](https://clarity.design/).  After instantly falling in love with it, I was sad to see that almost all documentation is geared towards their Angular integration.  As I mentioned earlier, this is a strictly _No JS Frameworks Allowed_ zone, so I almost gave up before I happened upon [Clarity's documentation for their core code](https://storybook.core.clarity.design/?path=/story/documentation-welcome--page).  This was just what I needed!  Elegant UI components, here I come!

## Code Overview

### Typing
The project is Typescript, but sadly, the Continuum Game Engine is not.  So I went through and typed all of the main classes and they are found in [gamelogic/types/Continuum/index.d.ts](https://github.com/robbob42/bobidle/blob/master/src/gamelogic/types/Continuum/index.d.ts).

### Extending the Engine
The Continuum engine is good, but not robust enough for what I needed with this game, so I extended several of the classes.  These can be found in the [gamelogic/classes](https://github.com/robbob42/bobidle/tree/master/src/gamelogic/classes) folder.  Any class starting with 'Game' is an extension of its similarly named Continuum parent.  All other classes extend Continuum's Entity object, to flesh out the inventory system.

### Entrypoint
The magic starts in the [gamelogic/game.ts](https://github.com/robbob42/bobidle/blob/master/src/gamelogic/game.ts) file.  This initiates the game engine, and initiates all of the classes needed for tracking game objects.  The other main file to note is the [gamelogic/gameUI.ts](https://github.com/robbob42/bobidle/blob/master/src/gamelogic/gameUI.ts) file.  This uses Continuum's event emitters to track key initial events on the plot.  This file also has the core update() function, which fires off every tick.

## Development

After cloning to your local machine, be sure to run `npm install` to populate your node_modules.  Other than that, the other npm scripts are pretty standard and can be found in the [package.json file](https://github.com/robbob42/bobidle/blob/master/package.json):

`npm run build` Builds the game bundle
`npm run start` Starts the local server