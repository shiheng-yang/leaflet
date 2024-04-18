export function visibleChange(flag, ref) {
  if (flag) {
    this.$refs[ref].focus()
  } else {
    this.$refs[ref].blur()
  }
}
