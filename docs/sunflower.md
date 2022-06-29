# Sunflower L-System

So I think for now I just want my "sunflower" to consist of three parts:
  * The shoot apical meristem, which will create the stems and the leaves.
  * The stems
  * The leaves

I don't think the shoot appical meristem should actually be draw, but I do
think its "age" should increase with every iteration, so that we can keep track
of when it should create the stems and leaves.

I also need to figure out what the growth functions for leaves should be...
but we can handle tha later.

---

I don't think that's going to work... Because eventually I want to add a bit
of randomness to when the leaves are born, and a new stem starts. So we need the
"age" of the top stem to continue increasing, until there is a new top stem,
when it stops. Which would mean the top stem should actually be the apical
meristem.

Or we could have the stem growth be defined by a function, like the leaf growth,
and the point where it becomes asymptotic will both determine the growth, and
when a new stem piece starts.

I guess it kind of depends on whether height growth is linear or exponential.
If it is linear, then I think the first approach makes sense. If it is
exponential, then something more like the second approach makes sense.

## Height growth

Why don't we assume the following:
  * The total height increases logistically/sigmoidally (based on wikipedia
    reading about plant growth)
  * The total number of leaves increases linearly (based on "The Plastochron
    "Index")

How do we want to implement this?

We could just tell the leaves their initial heights, and not worry about
actually modeling the stem segments, but this seems like a cheap option.

We need some way to make sure each stem segment only draws its correct height...
What if we tell it the day that it was born, and the day that it died? That way
it only needs to draw the difference between the two heights at that point in
time.

That sounds like a good initial plan.