export const steps = [
  {
    // element: "#seed_search",
    intro:
      "Do you wanna know what to do? Otherwise you can just close this guide 👍",
    title: "Welcome 🙋‍♂️",
    // position: "center",
    tooltipClass: "myTooltipClass",
  },
  {
    element: ".seed_search",
    title: "🔎 Seed Search",
    intro:
      "Everything starts with inspiration. Even this search. So we need to give it at least one genres/artist or track. So go ahead and chose something you like 🎧",
    position: "right",
    tooltipClass: "myTooltipClass",
    highlightClass: "myHighlightClass",
  },
  {
    element: "#seed_table",
    title: "🎼 Seed Table",
    intro:
      "Okay you found something, perfekt! 🥳 In this list are all chosen genres/artists or tracks. You can add up to five elements in order to narrwo down your results. Here you can also see some stats like BPM, Key etc.",
    position: "bottom",
    tooltipClass: "myTooltipClass",
    highlightClass: "myHighlightClass",
  },
  {
    title: "🎨 Audio features",
    intro: "Now we come to the real stuff 🧐",
    // position: "right",
    tooltipClass: "myTooltipClass",
    // highlightClass: "myHighlightClass",
  },
  {
    element: "#seed_radar",
    title: "🎨 Audio features",
    intro: "This is the i call it 'mood graph'.🤯 It shows you the mood or feeling of a track (and ONLY tracks). If you have multiple elements in the seedtable, you can see how broad you result might be. If most of them align it means your result will probably something like that. If they differ anything could happen 😅",
    position: "right",
    tooltipClass: "myTooltipClass",
    highlightClass: "myHighlightClass",
  },
  {
    element: "#recommendation_options",
    title: "🎨 Finetuning",
    intro: "If your not quite happy with your mood graph, or you just chose an artist or genres? Go ahead and tweak these parameters to your liking 😎. If you hover above the title of a parameter, an litle explanation will appear.",
    position: "right",
    tooltipClass: "myTooltipClass",
    highlightClass: "myHighlightClass",
  },
  {
    element: "#wish_me_luck",
    title: "🤩 Wish me luck",
    intro: "Now the time has come! Find out what you get with your search! Happy exploration of Spotify 🤘 If you need me again, im down at the bottom 😉",
    position: "right",
    tooltipClass: "myTooltipClass",
    highlightClass: "myHighlightClass"
  }
].map((item) => {
    return {
        exitOnOverlayClick: false,
        ...item
    }
});
