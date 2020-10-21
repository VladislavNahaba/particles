# Particles
Particles layout that can be set on body or at any dom-element.

## Installation
To install this library you have to add index.js file to your project and create new instance of ParticlesLayout class.

# Docs
constructor have such params: **selector**, **layout**, **particles**. 
## selector
Chose selector to append canvas element.  
**Default**: *body*
## layout. 
`color` - what color background of layout gonna be.  
**default** - *radial-gradient(#ffc38c, #ff9b40)*.  
`mouseRadiusMultiplier` - what radius of mouse going to push out particles.  
**default** - 1.  
## particles.
`color` - color of particles.  
**default** - #8c5523.  
`speed` - speed of particles.  
**default** - 3.  
`numberMultiplier` - number of particles on screen. *They depends on screen size*.  
**default** - 1.  
`size` - size of particles.  
**default** - 5.  
`connect` - enable connect between particles.  
**default** - true.  
`connectColor` - rgb color of connections.  
**default:**.  
```javascript
{
    r: 140,
    g: 85,
    b: 31
}
```
`connectLengthMultiplier` - connection length multiplier.  
**default** - 10.  
`connectOpacityMultiplier` - connection opacity to make dissapear animation   
**default** - 3.  

# Demo View
[![Demo view](https://i.ibb.co/GvTg3F1/ezgif-6-97872d91ccbb.gif)]

## License
[MIT](https://choosealicense.com/licenses/mit/)
