# Repository instructions

## User-owned relationship parameters

The user explicitly owns the following three expressions in `character-life.js`.
Preserve them verbatim. Do not change their ranges, lengths, age thresholds,
probabilities, generator bounds, or options during implementation, refactoring,
age-gating work, or test fixes. Only a subsequent explicit instruction from the
user changing this restriction can authorize edits to these expressions.

```js
rel('firstSex','Age of first sexual experience',['No sexual experience',UNKNOWN,...Array.from({length:95},(_,i)=>String(i+10))],{historyAge:10});
rel('firstSerious','Age of first serious relationship',['No serious relationship yet',UNKNOWN,...Array.from({length:108},(_,i)=>String(i+10))],{historyAge:10});
if(key==='firstSex')return random()<.2?'No sexual experience':String(int(10,Math.min(a,40),random));
```

The user plans to make a separate module for kids later. Do not modify these
parameters in anticipation of that module. If an existing test conflicts with
these user-owned parameters, report the conflict instead of rewriting the
parameters to satisfy the test, and continue any independent authorized work.
