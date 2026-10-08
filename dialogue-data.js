/* Editable writing directions. Add rows with permanent IDs; original pools stay untouched. */
(function(root){
'use strict';
const options=(prefix,rows)=>rows.map(([id,label,instruction,example])=>({id:prefix+'.'+id,label,instruction,example}));
const dialogue_amount=options('amount',[
 ['one-word','One-word answers','Use a single word for most replies; let surrounding action carry the explanation.','“Tomorrow.”'],
 ['brief','Concise replies','Answer in one short sentence and stop before adding background.','“The key is under the pot.”'],
 ['two-beat','Answer, then qualification','Give a short answer followed by one limiting detail.','“Yes. Until the rain starts.”'],
 ['explain','Extended explanations','Spend several sentences explaining how or why, even for a simple question.','“The latch sticks. Lift the handle first. Then pull toward you.”'],
 ['past-point','Keeps going','Continue with an extra detail after the practical point is already clear.','“Take the blue bus. It stops outside. They repainted it last spring.”'],
 ['minimal','Minimum necessary','Give only the piece of information the listener directly requested.','“Third floor.”'],
 ['story','A story before the answer','Tell a small incident before giving the requested answer.','“Last time, the stairs were locked. So yes, use the lift.”'],
 ['list','Lists instead of speeches','Break an explanation into a short spoken list.','“Bread, batteries, and a new lock. That’s all.”'],
 ['invited','Expands when invited','Begin with a brief answer; elaborate only after a follow-up question.','“It went badly.” / After “How?”: “They sent the wrong crate.”'],
 ['silence','Silence before words','Let a pause or action stand in for an answer before one short line.','They turn the cup. “Not yet.”'],
 ['topic-led','Long on familiar topics','Use long turns on a chosen familiar topic and short turns elsewhere.','“Fine.” / About the engine: “Start with the belt, then check the…”'],
 ['check-in','Small conversational packets','Deliver information in short pieces, checking that the other person follows.','“The front gate. You know it? Meet me there.”']
]);
const dialogue_sentence_shape=options('sentence',[
 ['fragments','Fragments','Leave out subjects or verbs when context supplies them.','“Too late. Wrong door.”'],
 ['complete','Complete sentences','Give each main statement an explicit subject and verb.','“The train has already left.”'],
 ['winding','Winding clauses','Add qualifications inside the sentence before reaching its end.','“If the gate, which was open yesterday, is still open, we can leave.”'],
 ['revisions','Frequent revisions','Show the speaker replacing a word or claim as they speak.','“It was Tuesday—no, the morning after.”'],
 ['conclusion','Conclusion first','State the conclusion, then give the reason.','“We should leave. The water is rising.”'],
 ['setup','Explanation first','Put the observations before the final conclusion.','“The lights are out and the road is empty. Let’s go.”'],
 ['parallel','Parallel clauses','Repeat a grammatical shape across neighboring clauses.','“You carry the bag. I carry the box.”'],
 ['nested','Nested asides','Insert a short aside into the middle of a sentence.','“The parcel—don’t open it here—goes upstairs.”'],
 ['condition','Conditional openings','Begin suggestions with an if-clause.','“If the shop is open, we can ask.”'],
 ['tag','Trailing checks','End assertions with a small confirmation question.','“We took this road before, didn’t we?”'],
 ['verb-first','Imperative openings','Start practical turns with an action verb.','“Hold the door. Watch the step.”'],
 ['afterthought','Sentence plus afterthought','Finish a sentence, then append a small separate correction.','“I know the address. Roughly.”']
]);
const dialogue_register=options('register',[
 ['ceremonial','Ceremonial','Use formal address and ritual phrasing for ordinary exchanges.','“May I request the honor of borrowing your pen?”'],
 ['professional','Professional','Use courteous task-oriented sentences with clear requests and deadlines.','“Please send the figures by four.”'],
 ['conversational','Conversational','Use contractions and everyday phrasing without heavy slang.','“We’ve got time for a cup.”'],
 ['slang','Slang-heavy','Choose a consistent local or peer-group vocabulary; define it for this character.','“That plan’s a total bust.”'],
 ['audience','Audience-dependent','Write a visibly different register for peers and for authority.','To a friend: “You coming?” / To a manager: “Will you be joining us?”'],
 ['stiff','Stiff courtesy','Keep polite formulae even in small or uncomfortable exchanges.','“Thank you for bringing that to my attention.”'],
 ['intimate','Intimate shorthand','Drop formal courtesies and use shared shorthand with close listeners.','“Same bench? After?”'],
 ['plain','Plainspoken','Prefer direct everyday statements over titles and polite padding.','“The roof leaks. We need a bucket.”'],
 ['archaic','Old-fashioned turns','Use a few established old-fashioned phrases without changing every word.','“I dare say we’ve missed the boat.”'],
 ['academic','Academic qualification','Qualify claims and name their limits as though making an argument.','“On the evidence we have, that seems unlikely.”'],
 ['service','Service-counter courtesy','Frame even personal exchanges as offers of practical assistance.','“What can I do to make this easier?”'],
 ['mock-formal','Playful formality','Apply grand formal phrases to small domestic requests.','“Your presence is required beside the toaster.”']
]);
const dialogue_word_choice=options('words',[
 ['technical','Technical jargon','Use precise terms from one established area of knowledge; avoid inventing expertise.','“The gasket is split, not the housing.”'],
 ['concrete','Concrete vocabulary','Name visible objects and actions rather than broad abstractions.','“Put the wet boots beside the stove.”'],
 ['elaborate','Elaborate vocabulary','Choose a less common precise word where a simple one would do.','“That explanation is impressively circuitous.”'],
 ['euphemism','Euphemisms','Soften a blunt fact with a substitute phrase.','“The arrangement has become less convenient.”'],
 ['borrowed','Borrowed expressions','Reuse expressions picked up from a particular person or source.','“As my aunt says, never argue with a kettle.”'],
 ['small-words','Short familiar words','Prefer common short words even for complicated matters.','“It costs more than we can pay.”'],
 ['metaphors','One recurring image family','Draw comparisons from one concrete area, such as cooking or sailing.','“That plan needs another hour in the oven.”'],
 ['exact','Exact nouns','Replace generic words with the exact object’s name when known.','“Bring the hex key, not the screwdriver.”'],
 ['approximate','Approximate labels','Use loose labels and approximations instead of exact names.','“The little metal thing by the sink.”'],
 ['hedges','Hedging words','Add perhaps, roughly, or probably to statements that could be direct.','“It’s probably around the next corner.”'],
 ['favorites','A few favorite words','Choose two or three recurring words and reuse them selectively.','“Odd. That’s an odd place for a chair.”'],
 ['literal','Literal descriptions','Replace figures of speech with descriptions of what actually happened.','“The meeting lasted three hours.”']
]);
const dialogue_profanity=options('profanity',[
 ['none','None','Use no profanity; let syntax or action express the intensity.','“Put it down. Now.”'],
 ['rare','Rare but emphatic','Reserve one swear word for a major break in composure.','“I said no. Damn it.”'],
 ['punctuation','Casual punctuation','Use mild profanity as an ordinary filler, without making each use an outburst.','“It’s a damn long walk.”'],
 ['insults','Creative insults','Use occasional insults built from concrete comparisons instead of repeating a stock swear.','“You soggy envelope of a man.”'],
 ['substitutes','Euphemistic substitutes','Replace the expected swear with a consistent harmless phrase.','“Oh, sugar. The handle broke.”'],
 ['audience','Audience-dependent','Use profanity with peers and visibly substitute clean phrasing elsewhere.','With friends: “That’s bullshit.” / At work: “That doesn’t add up.”'],
 ['self','Self-directed','Aim the occasional swear at their own mistake rather than another person.','“Damn me, I left the ticket.”'],
 ['objects','Swears at objects','Use an occasional swear for malfunctioning objects; address people more gently.','“Open, you bloody drawer.”'],
 ['whisper','Quiet profanity','Reserve rare swears for brief asides under the breath rather than the main reply.','“Of course.” Under their breath: “Shit.”'],
 ['formal','Profanity inside formality','Place an occasional blunt swear inside otherwise polished syntax.','“With respect, that is a bloody terrible idea.”'],
 ['quoted','Quoted profanity only','Use swear words only while explicitly quoting someone else.','“Her exact words were, ‘What the hell?’”'],
 ['escalating','Escalates in stages','Begin clean, move to a mild swear, and use stronger language only if pressure continues.','“Not again.” Later: “Damn.” Finally: “This is bullshit.”']
]);
// Relentless profanity and personal slurs: add options without changing the gentler pool.
const dialogue_constant_profanity=options('profanity-constant',[
 ['every-turn','Profanity in every turn','Put at least one swear word in every reply, including ordinary practical remarks.','“The fucking kettle is on.”'],
 ['every-sentence','Profanity in every sentence','Include a swear in each spoken sentence; keep the underlying sentence understandable.','“The damn door is stuck. Get the fucking key.”'],
 ['names','Insults instead of names','Use a personal insult as the listener’s form of address in nearly every exchange.','“Move the box, asshole.”'],
 ['commands','Profane commands','Make most replies commands, with profanity stressing the required action or object.','“Put the fucking phone down.”'],
 ['dismissals','Profane dismissals','Dismiss each unwanted explanation with a short profane rejection before stating the next step.','“Bullshit. Bring the receipt.”'],
 ['quiet','Quiet, constant contempt','Keep the delivery quiet and the wording profane in almost every reply; avoid exclamation marks.','“Sit down, you smug bastard.”'],
 ['no-filter','No audience filter','Use the same frequent strong profanity with friends, strangers, and authority.','To a supervisor: “Your fucking timetable is wrong.”'],
 ['stacked','Stacked personal insults','Put two or three personal insults into most confrontational turns, then make the practical demand.','“You lying, useless sack of shit. Give it back.”'],
 ['rotation','Rotating personal slurs','Rotate insults such as asshole, scumbag, shithead, and fuckwit through confrontational replies rather than repeating one epithet.','“Listen, fuckwit. The key stays here.”'],
 ['courtesy','Profanity through a polite frame','Use a polite opening followed by a blunt insult or swear in nearly every request.','“Be so kind as to shut your fucking mouth.”'],
 ['corrections','Insult with every correction','Attach a personal insult whenever correcting the listener; state the correction explicitly.','“The blue bag, dipshit. Not the red one.”'],
 ['refrain','A constant profane refrain','Choose one recurring swear phrase and use it as punctuation across almost every reply.','“For fuck’s sake, it’s Tuesday. For fuck’s sake, check the date.”']
]);
const dialogue_speech_presentation=options('speech-mark',[
 ['standard','Standard capitalization','Use ordinary capitalization and punctuation in spoken dialogue.','“We can leave now.”'],
 ['italic','Occasional italics','Italicize one word when the speaker contrasts it with another.','“I said *Tuesday*, not Thursday.”'],
 ['caps-word','Selected words in ALL CAPS','Capitalize only the word receiving unusually strong stress.','“I said the BLUE bag.”'],
 ['caps-line','ALL CAPS under pressure','Use an entire line in capitals only when calling over noise.','Over the engine: “SHUT THE DOOR!”'],
 ['lowercase','Lowercase dialogue','Present this character’s spoken lines in lowercase as a deliberate author convention.','“i can wait here.”'],
 ['ellipsis','Ellipses for hesitation','Use an ellipsis where the speaker hesitates before completing a thought.','“I thought… perhaps tomorrow.”'],
 ['dash','Dashes for correction','Use an em dash at the point of interruption or self-correction.','“Bring the red—sorry, the blue one.”'],
 ['repeat','Repeated words','Repeat a word to show insistence without naming an emotion.','“Wait. Wait, listen.”'],
 ['punctuation','Repeated punctuation selectively','Use doubled punctuation for occasional deliberately heightened lines.','“You sold it?!”'],
 ['stops','Short stops','Use periods to divide an emphatic statement into small units.','“The door. Stays. Shut.”'],
 ['run-on','Long punctuation-light turns','Let a rushing turn run across linked clauses with few internal stops.','“I went down and the door was open and nobody was there.”'],
 ['trail','Unfinished endings','End a line with an ellipsis when the speaker gives up finishing it.','“If you’d only told me…”']
]).map(o=>({...o,scope:'Spoken dialogue'}));
const dialogue_message_presentation=options('message-mark',[
 ['standard','Standard messages','Use normal capitalization, sentence punctuation, and a complete message.','“I’ll be there at six.”'],
 ['lowercase','Lowercase messages','Keep messages lowercase, including their openings.','“on my way. keep the door open.”'],
 ['caps-word','One capitalized priority','Put the most important word in capitals and leave the rest normal.','“Bring the SMALL box.”'],
 ['caps-line','Caps for urgent messages','Reserve all-capital messages for urgent practical warnings.','“DO NOT OPEN THAT DOOR.”'],
 ['ellipsis','Ellipses between thoughts','Separate message thoughts with ellipses rather than a full explanation.','“still here… missed the bus… try again at six”'],
 ['dash','Correction with a dash','Use a dash to visibly correct information within the same message.','“Tuesday—sorry, Wednesday.”'],
 ['repeat','Repeated words in messages','Repeat a key word rather than adding a long explanation.','“please please bring the key”'],
 ['punctuation','Expressive punctuation','Use repeated punctuation in messages while keeping spoken punctuation ordinary.','“you found it?? finally!!”'],
 ['bursts','Message bursts','Split one thought across several short consecutive messages.','“at the gate” / “wrong gate” / “coming round”'],
 ['no-stop','No final punctuation','Use sentence capitalization but omit final punctuation in short messages.','“I can wait outside”'],
 ['parentheses','Parenthetical asides','Add a small aside in parentheses after the practical message.','“I’m bringing lunch (the good bread).”'],
 ['formal','Letter-like messages','Give messages a greeting and closing even in a casual exchange.','“Hello Mara, the parcel arrived. Many thanks, Jo.”']
]).map(o=>({...o,scope:'Written messages'}));
const dialogue_multilingual=options('switch',[
 ['none','No switching','Keep each turn in its established language; use no language switches.','“I’ll wait by the door.”'],
 ['interjection','Interjections','Use a brief interjection in another established language, then return to the main language.','“[interjection], I forgot the key.”'],
 ['affection','Terms of affection','Use a term of affection from another established language with a chosen close audience.','“Come here, [term of affection].”'],
 ['quote','Quotations','Switch only to quote words originally said in another established language.','“She said, ‘[original words],’ and shut the door.”'],
 ['word-search','Searching for a word','Pause for a word in another established language, then paraphrase it if needed.','“It’s [word]—the feeling before a long journey.”'],
 ['upset','Switches when upset','Use the other established language for the first short phrase under pressure.','“[short phrase]. No, listen to me.”'],
 ['audience','A particular audience','Switch with one specified listener who shares that language.','To that listener: “[shared-language reply].”'],
 ['topic','A familiar subject','Switch for terms tied to a particular subject learned in that established language.','“Check the [established technical term] before starting.”'],
 ['privacy','Shared-language aside','Use a brief shared-language aside with a listener who understands it.','“[aside to the listener]. Anyway, we should go.”'],
 ['echo','Echoes before translating','Repeat another speaker’s established-language wording, then give the meaning in the main language.','“‘[quoted words]’—yes, that’s what she called it.”'],
 ['greeting','Greetings and farewells','Keep greetings or farewells in another established language; keep the body of the turn in the main one.','“[greeting]. Did the parcel arrive?”'],
 ['explain','Switch, then explain','Give a short established-language phrase and immediately explain it for the listener.','“[phrase]. It means we’ll manage somehow.”']
]);
const dialogue_conversational_behavior=options('conversation',[
 ['interrupt','Interrupts at the useful part','Cut in when the speaker hears a detail they can act on.','“And then the gate—” / “Which gate?”'],
 ['questions','Frequent questions','Insert short questions to move the exchange forward.','“Who called? When? Did they leave a number?”'],
 ['indirect','Avoids direct answers','Respond with related information rather than a yes or no.','“Are you coming?” / “The last bus leaves at ten.”'],
 ['echo','Repeats the other speaker','Begin a response by repeating a short part of the other turn.','“Too expensive?” / “Too expensive for that size, yes.”'],
 ['unfinished','Leaves replies unfinished','Stop a response before its conclusion and let the other person supply it.','“If the key is still inside, then…”'],
 ['clarify','Clarifies terms','Ask what a particular word means before responding to the larger claim.','“When you say soon, do you mean today?”'],
 ['redirect','Redirects to a task','Move from a difficult topic to a practical next step.','“We can argue later. Where’s the torch?”'],
 ['names','Uses the listener’s name','Place the listener’s name at the start of important requests.','“Mara, look at the latch.”'],
 ['confirm','Checks understanding','Paraphrase what they heard before adding their own view.','“So you left before the call. All right.”'],
 ['counter','Answers with a counterexample','Offer one concrete exception when someone makes a general claim.','“Every time?” / “It worked on Tuesday.”'],
 ['space','Leaves room','Give a short response and a pause that invites the other person to continue.','“I see.” They wait.'],
 ['return','Returns to an unanswered point','Bring an earlier unanswered question back after the topic moves on.','“Before we go: who has the spare key?”']
]);
const dialogue_thought_to_speech=options('thinking',[
 ['pause','Thinks before answering','Place a short observable pause before a considered sentence.','They set down the cup. “Take the side road.”'],
 ['discover','Discovers the point aloud','Let the reasoning unfold before the speaker notices their conclusion.','“The gate was open, so someone… Oh. Someone is still here.”'],
 ['blurt','Blurts conclusions','Put the conclusion out first; add reasoning only if challenged.','“They’re lying.” / “The times don’t match.”'],
 ['rehearse','Rehearses, then revises','Start with a polished phrase and visibly replace it with plainer wording.','“I regret to—look, I lost it.”'],
 ['count','Counts through a problem','Enumerate pieces of the problem aloud before deciding.','“One key, two doors, three people. We need a spare.”'],
 ['test','Tests a thought','Phrase a tentative idea aloud and adjust it using the listener’s reaction.','“Could we walk? No, you’re right. Too far.”'],
 ['question','Thinks in questions','Build the reasoning as questions the speaker partly answers.','“Who knew the code? Jo did. Who else?”'],
 ['restate','Restates to think','Repeat the problem in different words before proposing a solution.','“So the box fits, but the lid won’t shut.”'],
 ['action','Acts before explaining','Write a small action before the explanation of the decision.','They move the chair. “Now the door can open.”'],
 ['commit','Commits to the first wording','Keep an imperfect first sentence and explain it rather than rewriting it.','“It’s wrong. Wrong in the sense that it won’t fit.”'],
 ['separate','Keeps reasoning private','Give a decision without narrating the steps that led to it.','“Use the north entrance.”'],
 ['listener','Uses the listener as a sounding board','Ask the listener to follow one step of the reasoning at a time.','“Suppose it arrived yesterday. Then where would they put it?”']
]);
const dialogue_leave_unsaid=options('unsaid',[
 ['feelings','Feelings','Replace emotion names with observations or practical remarks.','“You’ve left your cup untouched.”'],
 ['names','Names','Use relationship labels or descriptions instead of a person’s name.','“The one who used to live upstairs called.”'],
 ['requests','Direct requests','Express a need as an observation and leave the listener to offer help.','“That shelf’s higher than I remembered.”'],
 ['shared','Shared explanations','Omit explanations they assume the listener already knows.','“Same reason as last time.”'],
 ['apology','Explicit apologies','Show an attempted repair without saying sorry.','“I brought you another one.”'],
 ['praise','Direct praise','Communicate approval by trusting the person with another task.','“You take the next turn too.”'],
 ['fear','What they fear','Mention precautions rather than the feared outcome.','“Check the lock twice before bed.”'],
 ['need','Personal needs','Ask about the other person’s needs while leaving their own unstated.','“Have you eaten anything?”'],
 ['history','The past incident','Use a shared reference instead of describing an old event.','“Not that road. You know why.”'],
 ['certainty','How certain they are','State an observation and leave the degree of confidence unstated.','“The paint is still wet.”'],
 ['promise','Explicit promises','Offer a concrete next action without declaring a commitment.','“I’ll bring the ladder at eight.”'],
 ['goodbye','Goodbyes','End exchanges with a practical remark instead of a farewell.','“Take the umbrella.”']
]);
const dialogue_situational_change=options('situation',[
 ['angry-short','Angry: short turns','Suspend the selected habit while angry; limit the next few turns to short commands.','“Put it down. Leave.”'],
 ['angry-formal','Angry: formal wording','Suspend the selected habit while angry; use complete, deliberately formal sentences.','“I would like you to return the key.”'],
 ['angry-repeat','Angry: repetition','Suspend the selected habit while angry; repeat the exact practical demand.','“Bring it back. Bring it back.”'],
 ['fear-check','Frightened: confirmation checks','Suspend the selected habit while frightened; turn assertions into checks with the listener.','“That’s the right door, isn’t it?”'],
 ['fear-fragment','Frightened: fragments','Suspend the selected habit while frightened; break explanations into fragments.','“The stairs. Someone there. Just now.”'],
 ['fear-precise','Frightened: precise instructions','Suspend the selected habit while frightened; name exact objects and actions.','“Turn the brass key twice.”'],
 ['comfortable-long','Comfortable: expands','Suspend the selected habit when comfortable; add one personal anecdote to an answer.','“Yes, that café. We used to stop there after school.”'],
 ['comfortable-loose','Comfortable: loose sentences','Suspend the selected habit when comfortable; allow fragments and shared shorthand.','“Same place? Usual time?”'],
 ['comfortable-play','Comfortable: playful formality','Suspend the selected habit when comfortable; make a small request sound ceremonious.','“Your attendance is required at the biscuit tin.”'],
 ['authority-complete','Authority: complete sentences','Suspend the selected habit with authority; replace casual shortcuts with complete sentences.','“I received the notice this morning.”'],
 ['authority-brief','Authority: brief answers','Suspend the selected habit with authority; answer exactly the question and add no story.','“At eight, sir.”'],
 ['authority-question','Authority: indirect requests','Suspend the selected habit with authority; frame a need as a polite question.','“Would it be possible to open the window?”']
]);
const wildcard_scopes=['One reply','One conversation','Recurring character habit'];
const wildcard_reasons=['No reason specified','A game with a friend','A private vow','A learned writing habit','A rehearsal exercise','An unexplained practice','A shared joke','A rule of a fictional club'];
const wildcard_parameters={letter:['e','a','s','t','r'],words:[3,5,7,9],subject:['money','a breakup','a lost job','a secret','an absent friend'],word:['still','door','perhaps','tomorrow','blue']};
// Counts use whitespace-separated words; no hyphenated compounds in the counted examples.
const counted_examples=['Wait.','Stay here.','Bring the box.','Please shut the door.','Please put that box down.','Please leave that box by me.','Please put that box by the door.','Please put that small box by the door.','Please put that small blue box by the door.','Please put that small blue box by the back door.','Please put that small blue box by the closed back door.','Please put that small blue box down by the closed back door.'];
const dialogue_wildcards=[
 {id:'none',label:'No wildcard',rule:'Add no writing constraint.',example:'“The parcel is here.”'},
 {id:'forbidden-letter',label:'Forbidden letter',rule:'In English, avoid the letter {letter} in this character’s dialogue, case-insensitively.',parameters:['letter'],language:'English',example:'“Run.”',defaults:{letter:'e'}},
 {id:'word-budget',label:'Word budget',rule:'In English, each reply contains {words} words or fewer. Count whitespace-separated words; punctuation does not add words.',parameters:['words'],language:'English',example:'“Bring the box.”',defaults:{words:3}},
 {id:'exact-length',label:'Exact length',rule:'In English, each spoken sentence contains exactly {words} whitespace-separated words. Punctuation does not add words.',parameters:['words'],language:'English',example:'“Please put that box down.”',defaults:{words:5}},
 {id:'single-syllables',label:'Single syllables',rule:'Use only one-syllable English words in the character’s replies. Check pronunciation manually.',language:'English',example:'“Put that red box by the door.”',manualCheck:'put / that / red / box / by / the / door: one syllable each in ordinary English pronunciation'},
 {id:'questions-only',label:'Questions only',rule:'Every sentence in the character’s reply must be a question.',example:'“Did the box arrive?”'},
 {id:'no-questions',label:'No questions',rule:'Use statements only; invite information by stating a gap or observation.',example:'“The delivery time is still missing.”'},
 {id:'no-pronouns',label:'No pronouns',rule:'In English, use names or explicit nouns instead of personal, possessive, demonstrative, relative, or indefinite pronouns.',language:'English',example:'“Mara needs fresh tea.”',manualCheck:'Mara: proper noun; needs: verb; fresh: adjective; tea: noun'},
 {id:'no-emotion',label:'No emotional vocabulary',rule:'Convey feelings through actions, objects, or observations without naming an emotion.',example:'“The cup has been cold for an hour.”',manualCheck:'No named emotion; the untouched cup supplies the implication.'},
 {id:'forbidden-subject',label:'Forbidden subject',rule:'Refer to {subject} only indirectly; do not name that subject in the character’s dialogue.',parameters:['subject'],example:'“That matter can wait.”',defaults:{subject:'money'}},
 {id:'concrete',label:'Concrete language',rule:'Use visible objects, sensory details, or physical actions instead of abstract concepts.',example:'“The lock broke. Bring a new key.”'},
 {id:'quotation-only',label:'Quotation only',rule:'Reply only with exact words already quoted in the scene; add no original wording.',example:'Earlier speaker: “Leave the light on.”\nReply: “Leave the light on.”'},
 {id:'mandatory-word',label:'Mandatory word',rule:'Include the exact word {word} in every reply, as a whole word; case does not matter.',parameters:['word'],example:'“Perhaps tomorrow.”',defaults:{word:'perhaps'}},
 {id:'borrowed-opening',label:'Borrowed opening',rule:'Begin each reply with a word used by the preceding speaker. Ignore case and surrounding punctuation.',example:'Other speaker: “Take the key.”\nReply: “Key first, bag later.”'},
 {id:'shrinking',label:'Shrinking replies',rule:'Within one conversation, each reply is shorter in word count than this character’s previous reply. For a recurring habit, restart the count in each conversation. For one reply, compare to their preceding reply.',example:'Earlier reply: “Please leave the box here.” (5 words)\nNext reply: “Leave the box.” (3 words)\nNext reply: “Here.” (1 word)'},
 {id:'one-switch',label:'One language switch per reply',rule:'Switch exactly once between two author-established languages in each reply. Establish ability in both languages before using this challenge; never infer it from heritage.',parameters:['languages'],example:'Illustration only — English → Spanish: “I will wait aquí.”',manualCheck:'English opening followed by Spanish aquí; one boundary. This illustration does not assign language proficiency.'},
 {id:'one-emphasis',label:'Exactly one emphasized word',rule:'Emphasize exactly one word per reply using italics. Leave all other words in ordinary type.',example:'“Bring the key *now*.”'},
 {id:'echo-turn',label:'Echo and turn',rule:'Repeat a phrase from the preceding speaker and give it a different meaning through the rest of the reply.',example:'Other speaker: “We need more room.”\nReply: “More room for mistakes, you mean.”'},
 {id:'implication',label:'Answer the implication',rule:'Answer the need or suggestion implied by the line, rather than its literal statement.',example:'Other speaker: “That shelf is high.”\nReply: “I’ll bring the ladder.”'},
 {id:'delayed',label:'Delayed answer',rule:'Answer the question from two exchanges earlier, leaving the current question unanswered. An exchange is one prompt followed by this character’s reply.',example:'Exchange 1 — “Who has the key?” / “Wait.”\nExchange 2 — “Where is the box?” / “One moment.”\nExchange 3 — “Are we leaving?” / “Mara has the key.”'},
 {id:'theft',label:'Vocabulary theft',rule:'Across successive replies, introduce words used by the other speaker; retain at least one adopted word and add another on the next reply. For one reply, apply the next step after an earlier adoption.',example:'Other: “It’s a tidy plan.” / Reply: “A tidy start.”\nOther: “Keep the route tidy and brisk.” / Reply: “A tidy, brisk walk, then.”'}
].map(o=>({...o,parameters:o.parameters||[],scopeOptions:wildcard_scopes}));
// Conservative automatic-pair exclusions. Manual choices remain intact and receive warnings.
const wildcard_incompatibilities=[
 ['questions-only','no-questions','One requires questions; the other forbids them.'],
 ['exact-length','shrinking','A fixed sentence length clashes with steadily shrinking short replies.'],
 ['quotation-only','mandatory-word','The available quotation may not contain the mandatory word.'],
 ['quotation-only','forbidden-letter','The available quotation may contain the forbidden letter.'],
 ['quotation-only','word-budget','The available quotation may exceed the word budget.'],
 ['quotation-only','exact-length','The available quotation may have the wrong sentence length.'],
 ['quotation-only','one-switch','The available quotation may not have exactly one language switch.'],
 ['quotation-only','borrowed-opening','The available quotation may not begin with a preceding-speaker word.'],
 ['quotation-only','no-pronouns','The available quotation may contain a pronoun.'],
 ['quotation-only','questions-only','The available quotation may be a statement.'],
 ['quotation-only','no-questions','The available quotation may be a question.'],
 ['quotation-only','single-syllables','The available quotation may contain words with several syllables.'],
 ['quotation-only','forbidden-subject','The available quotation may name the forbidden subject.'],
 ['quotation-only','no-emotion','The available quotation may name an emotion.'],
 ['quotation-only','concrete','The available quotation may use abstract words.'],
 ['quotation-only','echo-turn','Exact quotation leaves no room to turn the meaning with new wording.'],
 ['quotation-only','implication','The available quotation may not answer the implication.'],
 ['quotation-only','delayed','The available quotation may not answer the earlier question.'],
 ['quotation-only','theft','A fixed quotation prevents gradual vocabulary adoption.'],
 ['single-syllables','one-switch','The one-syllable English constraint does not cover another language.'],
 ['forbidden-letter','one-switch','The English letter constraint is not defined for the second language.'],
 ['exact-length','one-switch','The English-only counting rule does not define a mixed-language sentence.'],
 ['word-budget','one-switch','The English-only counting rule does not define a mixed-language reply.'],
 ['no-pronouns','one-switch','The English pronoun constraint does not define pronouns in the second language.'],
 ['delayed','implication','They target different prompts: an older question versus the current implication.'],
 ['shrinking','theft','Adding retained vocabulary can work against shorter replies.']
];
// These lists support conservative parameter-pair checks, not general language analysis.
const wildcard_checked_single_syllable_words=['still','door','blue','key','wait','go','run'];
const wildcard_pronoun_words=['i','me','my','mine','we','us','our','ours','you','your','yours','he','him','his','she','her','hers','it','its','they','them','their','theirs','this','that','these','those','who','whom','which','someone','anyone','everyone','something','anything','everything','none'];
const wildcard_emotion_words=['happy','sad','angry','fear','afraid','joy','love','hate','grief','anxious','excited','worried'];
const wildcard_parameter_rules=[
 {ids:['exact-length','word-budget'],check:'length-budget',reason:'Exact sentence length exceeds the reply’s word budget.'},
 {ids:['mandatory-word','forbidden-letter'],check:'word-letter',reason:'The mandatory word contains the forbidden letter.'},
 {ids:['mandatory-word','forbidden-subject'],check:'word-subject',reason:'The mandatory word names the forbidden subject.'},
 {ids:['mandatory-word','single-syllables'],check:'word-syllables',reason:'The mandatory word is not in the editable list of checked one-syllable English words.'},
 {ids:['mandatory-word','no-pronouns'],check:'word-pronoun',reason:'The mandatory word is an English pronoun.'},
 {ids:['mandatory-word','no-emotion'],check:'word-emotion',reason:'The mandatory word explicitly names an emotion.'}
];
root.DialogueData={dialogue_amount,dialogue_sentence_shape,dialogue_register,dialogue_word_choice,dialogue_profanity,dialogue_constant_profanity,dialogue_speech_presentation,dialogue_message_presentation,dialogue_multilingual,dialogue_conversational_behavior,dialogue_thought_to_speech,dialogue_leave_unsaid,dialogue_situational_change,dialogue_wildcards,wildcard_scopes,wildcard_reasons,wildcard_parameters,counted_examples,wildcard_incompatibilities,wildcard_parameter_rules,wildcard_checked_single_syllable_words,wildcard_pronoun_words,wildcard_emotion_words};
})(typeof window==='undefined'?globalThis:window);
