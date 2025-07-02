# My web development workflow (execution pipeline that enables activity that actually delivers useful output, instead of making circles and getting lost) is this:

• specifications first

• then, one by one, turn each specification into test case code via cursor AI, by copying and pasting the specification comment, then asking cursor AI to translate to code in test ile

• then I run the failing test

• after which I ask cursor AI to implement feature up to the point where the test succeeds

• then I test manually

If I am fixing something, I also work on a one-by-one basis. Please remember that.

# Component archaeology principle

- analyze what the problem is
- determine what components are relevant
- check each relevant component one by one, analyze it and understand it individually
- understand the relevant components as a connected chain, analyze interactions between them and understand them as a whole from start to finish
- investigate the problem space and analyze reality before proposing solutions
- look to just solve the problem as asked, don't jump ahead, don't rush to un-asked for optimizations, if you find something that's very sub-optimal - inform on it and propose options
