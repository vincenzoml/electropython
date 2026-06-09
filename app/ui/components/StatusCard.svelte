<script lang="ts">
  let { title, value, detail = '' } = $props<{ title: string; value: string; detail?: string }>();
</script>

<section class="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
  <p class="text-sm uppercase tracking-wide text-slate-300">{title}</p>
  <h2 class="mt-2 text-2xl font-bold">{value}</h2>
  {#if detail}
    <p class="mt-2 text-sm text-slate-300">{detail}</p>
  {/if}
</section>
