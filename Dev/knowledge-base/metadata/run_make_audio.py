
import sys
import os
# Set Google API key if available
if 'GOOGLE_API_KEY' in os.environ:
    print(f"Using Google API key (length: {len(os.environ['GOOGLE_API_KEY'])})")
else:
    print("No Google API key found, will use local models")

sys.argv = ['make_audio.py', '--pdf', 'documents\Supplementary_Attack_Defence.pdf', '--output_dir', 'C:\Dev\knowledge-base\processed\supplementary_test', '--format_type', 'summary', '--style', 'normal', '--length', 'short']
from local_notebooklm.make_audio import main
main()
