# Growth

We want to create a program that models and renders the growth of a plant.
Growth has two components:

* The graph/branching structure of the plant
* The size of the individual segments of the plant

## Structure

I think the structural components should be handled by an L-System, using node-
based rewriting. This matches my mental model of how plants grow.

## Size

I can think of two options for handling the growth of the size of parts of the
plant.

### L-System sizing

Using the L-System to model the growth of the plant would work in some cases.

I know from "The Algorithmic Beauty of Plants" that modeling exponential growth
functions is easy to do with an L-System. `F -> FF` is already exponential. And
I know from "The Plastochron Index" that leaf growth (as an example) begins
relatively exponentially.

However, I also know that leaf growth does not *stay* exponential. It
asymptotically approaches a maximum length (which is dependent on the leaf
number). Again from "The Plastochron Index".

And L-Systems are very bad at modeling things that approach values
asymptotically. Again from "The Algorithmic Beauty of Plants".

As such, I don't think using a plain L-System to model the growth in the size
of the plant is a good idea.

### Parametric sizing

I think that using a parameterized/parameteric L-System for modeling the growth
of the plants will work better.

There are two ways I can think of to handle the parameters:

#### Direct modification

We could model the growth in the size by directly modifying a parameter that
represents the size when we run the L-System. Eg `F(x) -> x * 2`, which is also
exponential.

F, FF, FFFF, FFFFFFFF
1, 2, 4, 8

But I think in this case we will also run into trouble modeling functions that
asymptotically approach values, because the input to our function will always
be the previous output.

#### Turtle interpretation

We could instead model the growth in the size by incrementing an "age" parameter
on the L-System "character". We can then have our turtle interpreter input that
age into our growth function. The growth function can then be whatever we want,
even a function that approaches some value asymptotically because the age input will be linear.

We can also add other constant parameters, like leaf number.

My one concern with this approach is: How do we get the timings right between
our sizing and our branching? I think we can just increment the age of the
shoot apical meristem as well, and have it use that to determine when to
branch, but I'm not sure.

# System design

I think I want to lay this out as three separate systems:
  1) The L-System... system. It will apply the productions and do all of those
     normal grammar-y things.
  2) The turtle interpreter. It will do normall turtle-y things, like keep track
     of its location and heading.
  3) A collection of drawing utils. Eg `drawLeaf(x, y, dir, length)`

## The L-System system

How to model the characters and productions programatically is tricky. We want:
  * Some identifier for the character
  * The ability to add an arbitrary number of (also identifiable) parameters
  * Some way to associate a production with the character

If types in TypeScript were first class, we could create a class for each
character, and use the class types as keys in map to productions.

But TypeScript is dumb so we can't do that.

Instead I guess we can still create classes, to give us a bit of type-safety,
but give them some kind of `identifier` string we can use to map to the
procedure.

We could use an object hash as the identifier, but I think that would
need to be static, and then applied to the instance, and that's getting pretty
weird and unexpected. Best to just keep things simple.

## The Turtle Interpreter

Should the turtle be a class, or a system? Maybe it makes the most sense for
it to be a class we construct in `setup` and then `run` on every draw step with
the most recent L-System output.

## Drawing utils

I think this is can just be a collection of functions.

# Notes

This doc only addresses modeling plants that have a single shoot apical
meristem, eg eudicots.
     