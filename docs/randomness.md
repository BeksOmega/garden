# Randomness

I want to add a bit of randomness to:
  * When the sunflower gets leaves
  * How tall the sunflower gets

But I still want the leaves to be generally linearly spaces wrt age.

I think we can get this working by asking for a random float, and if the float
is less than some number determined by a probability function whose input is
age, then we can create the leaf.

I think we should move the sigmoid functions into a dif file, so that they can
be depended on by the l-system and the turtle.