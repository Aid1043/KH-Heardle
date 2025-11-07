<template>
  <i></i>
</template>

<style scoped lang="scss">
i, :before, :after {
  position: relative;
  margin-right: 5px;
  margin-left: 5px;
  display: block;
  box-sizing: border-box;
  width: 2px;
  height: 12px;
  box-shadow: inset 0 -1px 0;
  -webkit-animation: play-loop 1.3s ease infinite alternate;
  animation: play-loop 1.3s ease infinite alternate;
}

:before  {
  content: "";
  position: absolute;
  left: -1px;
  -webkit-animation-delay: -2.4s;
  animation-delay: -2.4s;
}

:after {
  content: "";
  position: absolute;
  right: -1px;
  -webkit-animation-delay: -3.7s;
  animation-delay: -3.7s;
}

@-webkit-keyframes play-loop {
  10% {
    box-shadow: inset 0 -4px 0
  }
  30% {
    box-shadow: inset 0 -10px 0
  }
  60% {
    box-shadow: inset 0 -6px 0
  }
  80% {
    box-shadow: inset 0 -8px 0
  }
  to {
    box-shadow: inset 0 -2px 0
  }
}
@keyframes play-loop {
  10% {
    box-shadow: inset 0 -4px 0
  }
  30% {
    box-shadow: inset 0 -10px 0
  }
  60% {
    box-shadow: inset 0 -6px 0
  }
  80% {
    box-shadow: inset 0 -8px 0
  }
  to {
    box-shadow: inset 0 -2px 0
  }
}
</style>