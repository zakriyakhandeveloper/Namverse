const WEBHOOK_SECRET = process.env.REVALIDATE_WEBHOOK_SECRET || '';

async function revalidateName(religion, slug) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/revalidate`;

  const body = JSON.stringify({ religion, slug });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(WEBHOOK_SECRET && { Authorization: `Bearer ${WEBHOOK_SECRET}` }),
    },
    body,
  });

  const result = await response.json();
  console.log(`Revalidated: ${religion}/${slug}`);
  console.log('Response:', result);
  return result;
}

async function revalidateTag(tag) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/revalidate`;

  const body = JSON.stringify({ tag });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(WEBHOOK_SECRET && { Authorization: `Bearer ${WEBHOOK_SECRET}` }),
    },
    body,
  });

  const result = await response.json();
  console.log(`Revalidated tag: ${tag}`);
  console.log('Response:', result);
  return result;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage:');
  console.log('  node scripts/revalidate-name.js <religion> <slug>');
  console.log('  node scripts/revalidate-name.js --tag <tag-name>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/revalidate-name.js islamic abdullah');
  console.log('  node scripts/revalidate-name.js christian noah');
  console.log('  node scripts/revalidate-name.js --tag name-data');
  process.exit(1);
}

if (args[0] === '--tag') {
  revalidateTag(args[1] || 'name-data');
} else {
  const religion = args[0];
  const slug = args[1];
  if (!religion || !slug) {
    console.error('Error: Both religion and slug are required');
    console.log('Usage: node scripts/revalidate-name.js <religion> <slug>');
    process.exit(1);
  }
  revalidateName(religion, slug);
}
