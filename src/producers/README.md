# Producers

A producer is a generic class that maps one segment to another segment (possibly
with multiple children), replacing the original segment in the L-System.

A producer can have multiple data properties (e.g. probabilities) that influence
how it produces new segments.

Each producer has a type parameter for the type of segment it constructs, that
that it can be used with multiple concrete segment types, as long as they
fulfill the basic interface needed by the producer.

The properties of a producer are also serializable and deserializable so that it
can be saved and loaded.
