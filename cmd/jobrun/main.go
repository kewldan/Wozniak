// Command jobrun wraps a job command, reports its start and finish to the
// server and exits with the command's own exit code.
package main

import (
	"crypto/rand"
	"fmt"
	"io"
	"os"
)

const usage = "Usage: jobrun <job-id> -- <command> [args...]\n\n" +
	"Set WOZNIAK_URL and WOZNIAK_TOKEN in the environment.\n" +
	"Exit status 2 indicates incorrect usage.\n"

type invocation struct {
	jobID   string
	command []string
}

func parseArgs(args []string) (invocation, error) {
	if len(args) < 3 || args[0] == "" || args[0] == "--" || args[1] != "--" || args[2] == "" {
		return invocation{}, fmt.Errorf("expected a job ID and a command separated by --")
	}
	// Keep the executable and its arguments as separate strings after "--".
	return invocation{jobID: args[0], command: args[2:]}, nil
}

type runConfig struct {
	invocation
	serverURL string
	token     string
	runID     string
}

func prepareRun(inv invocation, getenv func(string) string) (runConfig, error) {
	// Read the settings the wrapper will use to send events to the server.
	cfg := runConfig{invocation: inv, serverURL: getenv("WOZNIAK_URL"), token: getenv("WOZNIAK_TOKEN")}
	if cfg.serverURL == "" || cfg.token == "" {
		return runConfig{}, fmt.Errorf("WOZNIAK_URL and WOZNIAK_TOKEN must be set")
	}
	var id [16]byte
	if _, err := rand.Read(id[:]); err != nil {
		return runConfig{}, fmt.Errorf("generate run ID: %w", err)
	}
	// Mark the random bytes as a version 4 UUID with the standard variant.
	id[6] = (id[6] & 0x0f) | 0x40
	id[8] = (id[8] & 0x3f) | 0x80
	cfg.runID = fmt.Sprintf("%x-%x-%x-%x-%x", id[:4], id[4:6], id[6:8], id[8:10], id[10:])
	return cfg, nil
}

func main() {
	// Skip the program name and use run's result as the process exit code.
	os.Exit(run(os.Args[1:], os.Getenv, os.Stdout, os.Stderr))
}

func run(args []string, getenv func(string) string, stdout, stderr io.Writer) int {
	if len(args) == 1 && args[0] == "--help" {
		fmt.Fprint(stdout, usage)
		return 0
	}
	inv, err := parseArgs(args)
	if err != nil {
		fmt.Fprintf(stderr, "jobrun: %v\n%s", err, usage)
		return 2
	}
	cfg, err := prepareRun(inv, getenv)
	if err != nil {
		fmt.Fprintf(stderr, "jobrun: %v\n", err)
		return 1
	}
	// The CLI currently stops after preparation. Execution is tracked in #15.
	fmt.Fprintf(stdout, "jobrun: prepared job %q with run ID %s\n", cfg.jobID, cfg.runID)
	return 0
}
